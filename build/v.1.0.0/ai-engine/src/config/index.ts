import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  logLevel: string;
  corsOrigin: string;
  frontendUrl: string;
  adminUrl: string;
  backendUrl: string;
  redisUrl: string;
  gemini: ProviderConfig;
  groq: ProviderConfig;
  openRouter: ProviderConfig;
  sambaNova: ProviderConfig;
  cerebras: ProviderConfig;
  openai: ProviderConfig;
}

function loadConfig(): AppConfig {
  const missing: string[] = [];

  const getEnv = (key: string, fallback?: string): string => {
    const val = process.env[key] || fallback;
    if (!val && !fallback) missing.push(key);
    return val ?? '';
  };

  const config: AppConfig = {
    port: parseInt(getEnv('AI_ENGINE_PORT', '6000'), 10),
    nodeEnv: getEnv('NODE_ENV', 'development'),
    logLevel: getEnv('LOG_LEVEL', 'info'),
    corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
    frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:5173'),
    adminUrl: getEnv('ADMIN_URL', 'http://localhost:5174'),
    backendUrl: getEnv('BACKEND_URL', 'http://localhost:5000'),
    redisUrl: getEnv('REDIS_URL', 'redis://localhost:6379'),
    gemini: {
      apiKey: getEnv('GEMINI_API_KEY'),
      model: getEnv('GEMINI_MODEL', 'gemini-1.5-pro'),
      maxTokens: parseInt(getEnv('GEMINI_MAX_TOKENS', '4096'), 10),
      temperature: parseFloat(getEnv('GEMINI_TEMPERATURE', '0.7')),
    },
    groq: {
      apiKey: getEnv('GROQ_API_KEY'),
      model: getEnv('GROQ_MODEL', 'llama3-70b-8192'),
      maxTokens: parseInt(getEnv('GROQ_MAX_TOKENS', '4096'), 10),
      temperature: parseFloat(getEnv('GROQ_TEMPERATURE', '0.7')),
    },
    openRouter: {
      apiKey: getEnv('OPENROUTER_API_KEY'),
      baseUrl: getEnv('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
      model: getEnv('OPENROUTER_MODEL', 'openai/gpt-4o'),
      maxTokens: parseInt(getEnv('OPENROUTER_MAX_TOKENS', '4096'), 10),
      temperature: parseFloat(getEnv('OPENROUTER_TEMPERATURE', '0.7')),
    },
    sambaNova: {
      apiKey: getEnv('SAMBANOVA_API_KEY'),
      baseUrl: getEnv('SAMBANOVA_BASE_URL', 'https://api.sambanova.ai/v1'),
      model: getEnv('SAMBANOVA_MODEL', 'Meta-Llama-3.1-8B-Instruct'),
      maxTokens: parseInt(getEnv('SAMBANOVA_MAX_TOKENS', '4096'), 10),
      temperature: parseFloat(getEnv('SAMBANOVA_TEMPERATURE', '0.7')),
    },
    cerebras: {
      apiKey: getEnv('CEREBRAS_API_KEY'),
      baseUrl: getEnv('CEREBRAS_BASE_URL', 'https://api.cerebras.ai/v1'),
      model: getEnv('CEREBRAS_MODEL', 'llama3.1-8b'),
      maxTokens: parseInt(getEnv('CEREBRAS_MAX_TOKENS', '4096'), 10),
      temperature: parseFloat(getEnv('CEREBRAS_TEMPERATURE', '0.7')),
    },
    openai: {
      apiKey: getEnv('OPENAI_API_KEY'),
      model: getEnv('OPENAI_MODEL', 'gpt-4o'),
      maxTokens: parseInt(getEnv('OPENAI_MAX_TOKENS', '4096'), 10),
      temperature: parseFloat(getEnv('OPENAI_TEMPERATURE', '0.7')),
    },
  };

  if (missing.length > 0 && config.nodeEnv === 'production') {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }

  return config;
}

export const config = loadConfig();
