import { config } from '../config/index.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private level: LogLevel = 'info';

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    this.level = (config.logLevel as LogLevel) || 'info';
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (this.levels[level] < this.levels[this.level]) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };

    const output = JSON.stringify(entry);

    switch (level) {
      case 'error':
        process.stderr.write(output + '\n');
        break;
      default:
        process.stdout.write(output + '\n');
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.log('error', message, metadata);
  }

  child(context: Record<string, unknown>): Logger {
    const childLogger = new Logger();
    const originalLog = childLogger.log.bind(this);
    return Object.assign(childLogger, {
      log: (level: LogLevel, message: string, metadata?: Record<string, unknown>) => {
        originalLog(level, message, { ...context, ...metadata });
      },
    });
  }
}

export const logger = new Logger();
export default logger;
