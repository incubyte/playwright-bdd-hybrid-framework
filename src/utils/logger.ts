export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  NONE = 5,
}

const LOG_LEVEL_MAP: { [key: string]: LogLevel } = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  none: LogLevel.NONE,
};

const configuredLevel: LogLevel = LOG_LEVEL_MAP[process.env.LOG_LEVEL?.toLowerCase() || 'info'] ?? LogLevel.INFO;

class Logger {
  private log(level: LogLevel, message: string, ...args: unknown[]) {
    if (level >= configuredLevel) {
      const timestamp = new Date().toISOString();
      const levelString = LogLevel[level];
      // eslint-disable-next-line no-console
      console.log(`[${timestamp}] [${levelString}] - ${message}`, ...args);
    }
  }

  debug(message: string, ...args: unknown[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }
  info(message: string, ...args: unknown[]) {
    this.log(LogLevel.INFO, message, ...args);
  }
  warn(message: string, ...args: unknown[]) {
    this.log(LogLevel.WARN, message, ...args);
  }
  error(message: string, ...args: unknown[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }
}

export const log = new Logger();
