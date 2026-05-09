import { z } from 'zod';
import { conceptSpecSchema } from './concept';
import { publishedLessonManifestSchema } from './publish';

export const validationIssueSeveritySchema = z.union([
  z.literal('error'),
  z.literal('warning'),
]);

export const validationIssueSchema = z.object({
  code: z.string(),
  path: z.string(),
  message: z.string(),
  severity: validationIssueSeveritySchema,
});

export const validateSpecRequestSchema = conceptSpecSchema;

export const validateSpecResponseSchema = z.object({
  success: z.boolean(),
  errors: z.array(validationIssueSchema),
  warnings: z.array(validationIssueSchema).default([]),
  data: conceptSpecSchema.optional(),
});

export const generateSpecRequestSchema = z.object({
  teacherPrompt: z.string().min(1),
  subject: z.literal('math').default('math'),
  grade: z.string().optional(),
  template: z.literal('function-transform').default('function-transform'),
  locale: z.string().default('zh-CN'),
});

export const generateSpecResponseSchema = z.object({
  success: z.boolean(),
  spec: conceptSpecSchema.optional(),
  validation: validateSpecResponseSchema.optional(),
  message: z.string().optional(),
  rawModelOutput: z.string().optional(),
});

export const publishLessonRequestSchema = z.object({
  spec: conceptSpecSchema,
});

export const publishLessonResponseSchema = z.object({
  success: z.boolean(),
  slug: z.string().optional(),
  manifest: publishedLessonManifestSchema.optional(),
  errors: z.array(validationIssueSchema).default([]),
});

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
});

export type ValidationIssueSeverity = z.infer<typeof validationIssueSeveritySchema>;
export type ValidationIssue = z.infer<typeof validationIssueSchema>;
export type ValidateSpecRequest = z.infer<typeof validateSpecRequestSchema>;
export type ValidateSpecResponse = z.infer<typeof validateSpecResponseSchema>;
export type GenerateSpecRequest = z.infer<typeof generateSpecRequestSchema>;
export type GenerateSpecResponse = z.infer<typeof generateSpecResponseSchema>;
export type PublishLessonRequest = z.infer<typeof publishLessonRequestSchema>;
export type PublishLessonResponse = z.infer<typeof publishLessonResponseSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
