import process from 'node:process';
import chalk, { type ChalkInstance } from 'chalk';

// Precise type definitions for log types
type LogType = 'info' | 'error' | 'warn' | 'debug' | 'success' | 'start' | 'http';

interface LogTypeConfig {
  emoji: string;
  label: string;
  color: ChalkInstance;
}

interface HttpDetails {
  method: string;
  url: string;
  status: number;
  duration: number;
}

// Comprehensive log types configuration
const LOG_TYPES: Record<LogType, LogTypeConfig> = {
  info: { emoji: '🔵', label: 'INFO', color: chalk.blue },
  error: { emoji: '🔴', label: 'ERROR', color: chalk.red },
  warn: { emoji: '🟡', label: 'WARN', color: chalk.yellow },
  debug: { emoji: '🔍', label: 'DEBUG', color: chalk.gray },
  success: { emoji: '✨', label: 'SUCCESS', color: chalk.green },
  start: { emoji: '🚀', label: 'START', color: chalk.magenta },
  http: { emoji: '🌐', label: 'HTTP', color: chalk.cyan },
};

// Typed terminal and formatting utilities
const getTerminalWidth = (): number => process.stdout.columns || 80;

const getFormattedTime = (): string => {
  const now = new Date();
  return chalk.gray(
    `${now.toLocaleTimeString('en-GB')}.${String(now.getMilliseconds()).padStart(3, '0')}`
  );
};

const createBorder = (title = ''): string => {
  const width = getTerminalWidth();
  const pattern = '═';
  const padding = width - title.length - 2;
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;

  const border = chalk.magenta(pattern.repeat(width));
  const titleLine = title
    ? chalk.magenta(`${pattern.repeat(leftPad)} ${title} ${pattern.repeat(rightPad)}`)
    : border;

  return `\n${border}\n${titleLine}\n${border}\n`;
};

const formatError = (error: Error): string => {
  if (!error.stack) { return chalk.red(error.message); }

  const lines = error.stack.split('\n');
  const message = lines[0];
  const stack = lines
    .slice(1)
    .map(line => {
      const [, method, path] = line.match(/at (.+) \((.+)\)/) || [null, line.trim(), ''];
      return chalk.gray(`  ┃  ${chalk.white(method)} ${chalk.gray(path)}`);
    })
    .join('\n');

  return `${chalk.red.bold(message)}\n${stack}`;
};

const getStatusColor = (status: number): ChalkInstance => {
  if (status < 400) { return chalk.green; }
  if (status < 500) { return chalk.yellow; }
  return chalk.red;
};

const formatHttpDetails = (details: HttpDetails): string => {
  const { method, url, status, duration } = details;
  const statusColor = getStatusColor(status);

  return chalk.gray(
    `${chalk.bold(method)} ${url} ${statusColor(status)} ${chalk.gray(`${duration}ms`)}`
  );
};

// Advanced typed logger creator
export const createLogger = (name = ''): {
  info: (message: string) => void;
  error: (message: string, error?: Error) => void;
  warn: (message: string) => void;
  debug: (message: string) => void;
  success: (message: string) => void;
  start: (message: string) => void;
  http: (message: string, details: HttpDetails) => void;
} => {
  const formatLogMessage = (
    type: LogType,
    message: string,
    error?: Error,
    details?: HttpDetails
  ): string => {
    const { emoji, label, color } = LOG_TYPES[type];
    const timestamp = getFormattedTime();
    const category = name ? chalk.blue(`[${name}]`) : '';

    const baseMessage = `${emoji} ${label} ${category} ${message}`;
    const padding = getTerminalWidth() - baseMessage.length - timestamp.length - 5;

    let output = `${emoji} ${color.bold(label)} ${category} ${color(message)}`;
    output += ' '.repeat(Math.max(padding, 1));
    output += timestamp;

    if (details && type === 'http') {
      output += `\n  ${formatHttpDetails(details)}`;
    }

    if (error) {
      const separator = chalk.gray('─'.repeat(getTerminalWidth()));
      output += `\n${separator}\n${formatError(error)}\n${separator}`;
    }

    return output;
  };

  return {
    info: (message: string): void => {
      console.log(formatLogMessage('info', message));
    },
    error: (message: string, error?: Error): void => {
      console.error(formatLogMessage('error', message, error));
    },
    warn: (message: string): void  => {
      console.warn(formatLogMessage('warn', message));
    },
    debug: (message: string): void => {
      console.debug(formatLogMessage('debug', message));
    },
    success: (message: string): void => {
      console.log(formatLogMessage('success', message));
    },
    start: (message: string) => {
      console.log(createBorder('STARTUP'));
      console.log(formatLogMessage('start', message));
      console.log(createBorder());
    },
    http: (message: string, details: HttpDetails) => {
      console.log(formatLogMessage('http', message, undefined, details));
    }
  };
};

// Typed HTTP middleware
export const createHttpLogger = (
  logger: ReturnType<typeof createLogger>
) => (
  req: { method: string, url: string },
  res: { statusCode: number, on: (event: string, callback: () => void) => void },
  next: () => void
): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.http('Request processed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration
    });
  });

  next();
};