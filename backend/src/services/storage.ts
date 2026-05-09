import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env';

export function resolvePublishedLessonDir(slug: string) {
  return path.join(env.storageLocalPath, slug);
}

export async function writeJsonFile(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function readJsonFile<T>(filePath: string) {
  const contents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(contents) as T;
}
