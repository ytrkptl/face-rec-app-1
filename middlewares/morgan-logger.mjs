import dotenv from 'dotenv';
import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// create a rotating write stream
const accessLogStream = createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(process.cwd(), 'logs'),
});

const loggerMiddleware = morgan('combined', { stream: accessLogStream });

export default loggerMiddleware;