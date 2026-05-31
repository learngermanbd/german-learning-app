import { Worker } from 'bullmq';
import { emailQueue } from '../queue/jobQueue';
import { emailService } from './emailService';
import type { EmailOptions } from './emailService';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

const connection = { url: env.REDIS_URL };

export function startEmailWorker(): void {
  const worker = new Worker<EmailOptions>(
    'email',
    async (job) => {
      logger.info(`Processing email job ${job.id}: ${job.data.subject}`);
      const result = await emailService.send(job.data);

      if (result.error) {
        throw new Error(result.error);
      }

      return { sent: true, emailId: result.id, jobId: job.id };
    },
    { connection },
  );

  worker.on('completed', (job) => {
    logger.info(`Email job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Email job ${job?.id} failed: ${err.message}`);
  });

  logger.info('Email worker started');
}
