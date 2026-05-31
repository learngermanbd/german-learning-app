import { Queue, Worker, QueueEvents } from 'bullmq';
import { logger } from '../../utils/logger';
import { env } from '../../config/env';
import type { EmailOptions } from '../email/emailService';

const connection = { url: env.REDIS_URL };

export const aiGenerationQueue = new Queue('ai-generation', { connection });
export const aiEvaluationQueue = new Queue('ai-evaluation', { connection });
export const emailQueue = new Queue('email', { connection });

const queueEvents = new QueueEvents('ai-generation', { connection });

export interface AIJobData {
  type: 'generate-content' | 'evaluate-response' | 'chat-message' | 'extract-vocabulary';
  payload: Record<string, unknown>;
  userId?: string;
  timestamp?: number;
}

export async function enqueueAIJob(jobData: AIJobData): Promise<string | undefined> {
  const queueMap = {
    'generate-content': aiGenerationQueue,
    'evaluate-response': aiEvaluationQueue,
    'chat-message': aiGenerationQueue,
    'extract-vocabulary': aiGenerationQueue,
  };

  const queue = queueMap[jobData.type] || aiGenerationQueue;
  const job = await queue.add(jobData.type, jobData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });

  logger.info(`Job enqueued: ${job.id} (${jobData.type})`);
  return job.id;
}

export function startAIWorker(): void {
  const worker = new Worker(
    'ai-generation',
    async (job) => {
      logger.info(`Processing job ${job.id}: ${job.name}`);
      const data = job.data as AIJobData;

      switch (data.type) {
        case 'generate-content':
          logger.info(`Generating content: ${JSON.stringify(data.payload)}`);
          break;
        case 'chat-message':
          logger.info(`Processing chat message for user: ${data.userId}`);
          break;
        case 'extract-vocabulary':
          logger.info(`Extracting vocabulary: ${JSON.stringify(data.payload)}`);
          break;
        default:
          logger.warn(`Unknown job type: ${data.type}`);
      }

      return { processed: true, jobId: job.id };
    },
    { connection },
  );

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
  });

  logger.info('AI worker started');
}

export async function enqueueEmail(emailData: EmailOptions): Promise<string | undefined> {
  const job = await emailQueue.add('send-email', emailData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });

  logger.info(`Email job enqueued: ${job.id} — to: ${emailData.to}, subject: ${emailData.subject}`);
  return job.id;
}

export async function getJobStatus(jobId: string): Promise<string | null> {
  const job = await aiGenerationQueue.getJob(jobId);
  if (!job) return null;
  return job.finishedOn ? 'completed' : job.failedReason ? 'failed' : 'active';
}
