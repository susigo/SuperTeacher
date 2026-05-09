import path from 'node:path';
import { Router } from 'express';
import type { ConceptSpec, PublishedLessonManifest } from '@superteacher/contracts';
import { publishLesson } from '../services/publishLesson';
import { readJsonFile, resolvePublishedLessonDir } from '../services/storage';

export const publishRouter = Router();

publishRouter.post('/publish', async (req, res) => {
  const result = await publishLesson(req.body as ConceptSpec);
  return res.status(result.success ? 200 : 400).json(result);
});

publishRouter.get('/published/:slug/manifest', async (req, res) => {
  try {
    const lessonDir = resolvePublishedLessonDir(req.params.slug);
    const manifest = await readJsonFile<PublishedLessonManifest>(path.join(lessonDir, 'manifest.json'));
    return res.json(manifest);
  } catch {
    return res.status(404).json({ message: 'published lesson not found' });
  }
});

publishRouter.get('/published/:slug/concept', async (req, res) => {
  try {
    const lessonDir = resolvePublishedLessonDir(req.params.slug);
    const concept = await readJsonFile<ConceptSpec>(path.join(lessonDir, 'concept.json'));
    return res.json(concept);
  } catch {
    return res.status(404).json({ message: 'published lesson not found' });
  }
});
