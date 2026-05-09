import path from 'node:path';

export const env = {
  port: Number(process.env.PORT || 3001),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  storageLocalPath: path.resolve(process.env.STORAGE_LOCAL_PATH || './storage/published'),
  runtimeVersion: process.env.RUNTIME_VERSION || '0.1.0',
};
