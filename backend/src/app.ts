import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { healthRouter } from './routes/health';
import { publishRouter } from './routes/publish';
import { specRouter } from './routes/spec';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api', healthRouter);
  app.use('/api/v1', specRouter);
  app.use('/api/v1', publishRouter);

  return app;
}
