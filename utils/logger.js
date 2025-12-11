import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m'
};

const getColorForLevel = (level) => {
  switch (level) {
    case 'error': return colors.red;
    case 'warn': return colors.yellow;
    case 'info': return colors.green;
    case 'debug': return colors.blue;
    default: return colors.reset;
  }
};

const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...data
  };

  return JSON.stringify(logEntry);
};

export const logger = {
  error: (message, data = {}) => {
    const log = formatLog('error', message, data);
    console.error(`${getColorForLevel('error')}[ERROR]${colors.reset} ${message}`, data);
    fs.appendFileSync(path.join(logsDir, 'error.log'), log + '\n');
  },

  warn: (message, data = {}) => {
    const log = formatLog('warn', message, data);
    console.warn(`${getColorForLevel('warn')}[WARN]${colors.reset} ${message}`, data);
    fs.appendFileSync(path.join(logsDir, 'warn.log'), log + '\n');
  },

  info: (message, data = {}) => {
    const log = formatLog('info', message, data);
    console.log(`${getColorForLevel('info')}[INFO]${colors.reset} ${message}`, data);
    fs.appendFileSync(path.join(logsDir, 'info.log'), log + '\n');
  },

  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const log = formatLog('debug', message, data);
      console.debug(`${getColorForLevel('debug')}[DEBUG]${colors.reset} ${message}`, data);
      fs.appendFileSync(path.join(logsDir, 'debug.log'), log + '\n');
    }
  },

  request: (req) => {
    logger.info('Incoming Request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  },

  response: (req, statusCode, duration) => {
    logger.info('Outgoing Response', {
      method: req.method,
      path: req.path,
      statusCode,
      duration: `${duration}ms`
    });
  }
};

export default logger;
