import { z } from 'zod';

export const publishedLessonManifestSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  schemaVersion: z.literal('0.1.0'),
  template: z.literal('function-transform'),
  createdAt: z.string().datetime(),
  runtimeVersion: z.string().min(1),
  conceptSha256: z.string().min(64).max(64),
  entry: z.string().min(1),
  assets: z.array(z.string()).default([]),
});

export type PublishedLessonManifest = z.infer<typeof publishedLessonManifestSchema>;
