import { format, Logger, loggers, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const rotateFileBaseOptions = {
  datePattern: 'YYYY-MM-DD',
  // zippedArchive: true,
  maxSize: '20m',
  maxFiles: '15d',
  dirname: './logs',
};

const formatBase = format.combine(
  // format.colorize(),
  format.splat(),
  // format.json(),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.printf(({ timestamp, level, message, meta }) => {
    return `${timestamp} | ${level.toUpperCase().padEnd(5, ' ')} | ${message} | ${meta ? JSON.stringify(meta) : ''}`;
  }),
);

loggers.add('default', {
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      ...{
        filename: 'foxbit-client-%DATE%.log',
      },
      ...rotateFileBaseOptions,
    }),
  ],
  format: formatBase,
});

loggers.add('ws', {
  transports: [
    new DailyRotateFile({
      ...{
        filename: 'foxbit-client-%DATE%.websocket.log',
      },
      ...rotateFileBaseOptions,
    }),
  ],
  format: formatBase,
});

export const logger: Logger = loggers.get('default');

export const wsLogger: Logger = loggers.get('ws');
