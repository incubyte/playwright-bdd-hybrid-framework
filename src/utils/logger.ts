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

const configuredLevel: LogLevel = LOG_LEVEL_MAP[process.env.LOG_LEVEL?.toLowerCase() || 'info'];

class Logger {
  private log(level: LogLevel, message: string, ...args: any[]) {
    if (level >= configuredLevel) {
      const timestamp = new Date().toISOString();
      const levelString = LogLevel[level];
      console.log(`[${timestamp}] [${levelString}] - ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]) { this.log(LogLevel.DEBUG, message, ...args); }
  info(message: string, ...args: any[]) { this.log(LogLevel.INFO, message, ...args); }
  warn(message: string, ...args: any[]) { this.log(LogLevel.WARN, message, ...args); }
  error(message: string, ...args: any[]) { this.log(LogLevel.ERROR, message, ...args); }
}

export const log = new Logger();
