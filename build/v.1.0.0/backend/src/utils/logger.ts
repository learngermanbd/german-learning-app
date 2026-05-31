import { env } from '../config/env';

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 } as const;
type LogLevel = keyof typeof LOG_LEVELS;

const currentLevel: LogLevel = env.LOG_LEVEL;

function log(level: LogLevel, message: string, data?: any) {
  if (LOG_LEVELS[level] > LOG_LEVELS[currentLevel]) return;
  const timestamp = new Date().toISOString();
  const entry = { timestamp, level, message, ...(data && { data }) };
  if (level === 'error') console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

export const logger = {
  error: (message: string, data?: any) => log('error', message, data),
  warn: (message: string, data?: any) => log('warn', message, data),
  info: (message: string, data?: any) => log('info', message, data),
  debug: (message: string, data?: any) => log('debug', message, data),
};
