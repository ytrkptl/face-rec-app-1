import dotenv from 'dotenv';
import *  as  winston from 'winston';
import 'winston-daily-rotate-file';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const transport = new winston.transports.DailyRotateFile({
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

// if we are not in production, log to the console for all levels

transport.on('error', error => {
  // log or handle errors here
  // if we are not in production, log to the console
  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }
});

const transports = [
  transport
];

// Add console transport if not in production
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: transports
});

export default logger;