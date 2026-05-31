import axios from 'axios';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { cache } from '../cache/redisCache';

const AI_ENGINE_URL = env.AI_ENGINE_URL;

export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  userId?: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface UsageLogEntry {
  userId: string | undefined;
  action: string;
  model: string;
  tokens: number;
  latencyMs: number;
  success: boolean;
  timestamp: string;
}

const usageLog: UsageLogEntry[] = [];
const MAX_LOG_SIZE = 1000;

function logUsage(entry: UsageLogEntry): void {
  usageLog.push(entry);
  if (usageLog.length > MAX_LOG_SIZE) usageLog.shift();
  logger.debug('AI usage logged', entry);
}

export class AIOrchestrator {
  private fallbackProviders: string[] = ['gemini', 'groq', 'openrouter'];

  async generateContent(request: AIRequest): Promise<AIResponse> {
    const cacheKey = `ai:content:${Buffer.from(request.prompt.slice(0, 100)).toString('base64')}`;
    const ttl = 3600;

    return cache.getOrFetch(
      cacheKey,
      async () => {
        const start = Date.now();
        try {
          const response = await axios.post(`${AI_ENGINE_URL}/api/v1/ai/content/generate`, {
            prompt: request.prompt,
            systemPrompt: request.systemPrompt,
            temperature: request.temperature ?? 0.7,
            maxTokens: request.maxTokens ?? 2048,
          }, { timeout: 30000 });

          const result: AIResponse = {
            content: response.data.content,
            model: response.data.model || 'ai-engine',
            usage: response.data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          };

          logUsage({
            userId: request.userId,
            action: 'generateContent',
            model: result.model,
            tokens: result.usage.totalTokens,
            latencyMs: Date.now() - start,
            success: true,
            timestamp: new Date().toISOString(),
          });

          return result;
        } catch (error: any) {
          logger.warn(`AI Engine unreachable (${error.message}), falling back to direct provider`);

          for (const provider of this.fallbackProviders) {
            try {
              const fallbackResponse = await axios.post(`${AI_ENGINE_URL}/api/v1/ai/${provider}/generate`, {
                prompt: request.prompt,
                systemPrompt: request.systemPrompt,
                temperature: request.temperature ?? 0.7,
                maxTokens: request.maxTokens ?? 2048,
              }, { timeout: 15000 });

              const result: AIResponse = {
                content: fallbackResponse.data.content || fallbackResponse.data.text || '',
                model: `${provider}-fallback`,
                usage: fallbackResponse.data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
              };

              logUsage({
                userId: request.userId,
                action: `generateContent:fallback:${provider}`,
                model: result.model,
                tokens: result.usage.totalTokens,
                latencyMs: Date.now() - start,
                success: true,
                timestamp: new Date().toISOString(),
              });

              return result;
            } catch {
              continue;
            }
          }

          logUsage({
            userId: request.userId,
            action: 'generateContent',
            model: 'none',
            tokens: 0,
            latencyMs: Date.now() - start,
            success: false,
            timestamp: new Date().toISOString(),
          });

          throw new Error('All AI providers failed');
        }
      },
      ttl,
    );
  }

  async evaluateResponse(type: 'speaking' | 'writing' | 'exercise', content: string, context: Record<string, unknown>): Promise<AIResponse> {
    const start = Date.now();
    const cacheKey = `ai:evaluate:${type}:${Buffer.from(content.slice(0, 80)).toString('base64')}`;
    const ttl = 300;

    return cache.getOrFetch(
      cacheKey,
      async () => {
        try {
          const response = await axios.post(`${AI_ENGINE_URL}/api/v1/ai/content/generate`, {
            prompt: `Evaluate this ${type} response:\n\n${content}\n\nContext: ${JSON.stringify(context)}\n\nProvide detailed feedback.`,
            systemPrompt: `You are a German language evaluator. Assess the ${type} response and provide scores and feedback.`,
            temperature: 0.3,
            maxTokens: 1024,
          }, { timeout: 20000 });

          const result: AIResponse = {
            content: response.data.content,
            model: response.data.model || 'ai-engine',
            usage: response.data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          };

          logUsage({
            userId: (context.userId as string) || undefined,
            action: `evaluate:${type}`,
            model: result.model,
            tokens: result.usage.totalTokens,
            latencyMs: Date.now() - start,
            success: true,
            timestamp: new Date().toISOString(),
          });

          return result;
        } catch (error: any) {
          logUsage({
            userId: (context.userId as string) || undefined,
            action: `evaluate:${type}`,
            model: 'none',
            tokens: 0,
            latencyMs: Date.now() - start,
            success: false,
            timestamp: new Date().toISOString(),
          });

          throw new Error(`Evaluation failed: ${error.message}`);
        }
      },
      ttl,
    );
  }

  async chatWithTutor(message: string, history: { role: string; content: string }[], level: string): Promise<AIResponse> {
    const cacheKey = `ai:chat:${level}:${Buffer.from(message.slice(0, 50)).toString('base64')}`;
    const ttl = 300;

    return cache.getOrFetch(
      cacheKey,
      async () => {
        const start = Date.now();
        const historyText = history.map(h => `${h.role}: ${h.content}`).join('\n');

        try {
          const response = await axios.post(`${AI_ENGINE_URL}/api/v1/ai/content/generate`, {
            prompt: `User: ${message}\n\nConversation history:\n${historyText}`,
            systemPrompt: `You are a German tutor speaking with a ${level} level learner. Respond in German, adjust complexity to ${level}, correct gently.`,
            temperature: 0.7,
            maxTokens: 512,
          }, { timeout: 15000 });

          const result: AIResponse = {
            content: response.data.content,
            model: response.data.model || 'ai-engine',
            usage: response.data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          };

          logUsage({
            userId: undefined,
            action: 'chatWithTutor',
            model: result.model,
            tokens: result.usage.totalTokens,
            latencyMs: Date.now() - start,
            success: true,
            timestamp: new Date().toISOString(),
          });

          return result;
        } catch (error: any) {
          logUsage({
            userId: undefined,
            action: 'chatWithTutor',
            model: 'none',
            tokens: 0,
            latencyMs: Date.now() - start,
            success: false,
            timestamp: new Date().toISOString(),
          });

          throw new Error(`Chat failed: ${error.message}`);
        }
      },
      ttl,
    );
  }

  async extractVocabulary(text: string, level: string): Promise<AIResponse> {
    const cacheKey = `ai:vocab:${level}:${Buffer.from(text.slice(0, 80)).toString('base64')}`;
    const ttl = 3600;

    return cache.getOrFetch(
      cacheKey,
      async () => {
        const start = Date.now();

        try {
          const response = await axios.post(`${AI_ENGINE_URL}/api/v1/ai/content/generate`, {
            prompt: `Extract German vocabulary from this text for ${level} level learners:\n\n"${text}"\n\nFor each word provide: german word (with article), english translation, example sentence, difficulty level.`,
            systemPrompt: `You are a German vocabulary extraction specialist. Extract level-appropriate vocabulary with definitions and examples.`,
            temperature: 0.3,
            maxTokens: 2048,
          }, { timeout: 15000 });

          const result: AIResponse = {
            content: response.data.content,
            model: response.data.model || 'ai-engine',
            usage: response.data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          };

          logUsage({
            userId: undefined,
            action: 'extractVocabulary',
            model: result.model,
            tokens: result.usage.totalTokens,
            latencyMs: Date.now() - start,
            success: true,
            timestamp: new Date().toISOString(),
          });

          return result;
        } catch (error: any) {
          logUsage({
            userId: undefined,
            action: 'extractVocabulary',
            model: 'none',
            tokens: 0,
            latencyMs: Date.now() - start,
            success: false,
            timestamp: new Date().toISOString(),
          });

          throw new Error(`Vocabulary extraction failed: ${error.message}`);
        }
      },
      ttl,
    );
  }

  getUsageLog(): UsageLogEntry[] {
    return [...usageLog];
  }
}

export const aiOrchestrator = new AIOrchestrator();
export default aiOrchestrator;
