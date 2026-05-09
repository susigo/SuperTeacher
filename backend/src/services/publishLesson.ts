import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { ConceptSpec, PublishedLessonManifest } from '@superteacher/contracts';
import { validateForPublish } from '@superteacher/edu-validation';
import { env } from '../config/env';
import { resolvePublishedLessonDir, writeJsonFile } from './storage';

export async function publishLesson(spec: ConceptSpec) {
  const validation = validateForPublish(spec);
  if (!validation.success || !validation.data) {
    return { success: false as const, errors: validation.errors };
  }

  const slug = createLessonSlug(spec.concept.title);
  const lessonDir = resolvePublishedLessonDir(slug);
  const conceptJson = JSON.stringify(validation.data, null, 2);
  const conceptSha256 = crypto.createHash('sha256').update(conceptJson).digest('hex');
  const manifest: PublishedLessonManifest = {
    slug,
    title: validation.data.concept.title,
    schemaVersion: validation.data.schemaVersion,
    template: validation.data.interaction.template,
    createdAt: new Date().toISOString(),
    runtimeVersion: env.runtimeVersion,
    conceptSha256,
    entry: `/p/${slug}`,
    assets: [],
  };

  await fs.mkdir(path.join(lessonDir, 'assets'), { recursive: true });
  await fs.mkdir(path.join(lessonDir, 'snapshots'), { recursive: true });
  await writeJsonFile(path.join(lessonDir, 'manifest.json'), manifest);
  await writeJsonFile(path.join(lessonDir, 'concept.json'), validation.data);

  return { success: true as const, slug, manifest, errors: [] };
}

function createLessonSlug(title: string) {
  const readable = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const suffix = crypto.randomBytes(4).toString('hex');
  return `${readable || 'lesson'}-${suffix}`;
}
