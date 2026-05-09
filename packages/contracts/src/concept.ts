import { z } from 'zod';

export const schemaVersionSchema = z.literal('0.1.0');

export const projectTypeSchema = z.union([
  z.literal('concept-card'),
  z.literal('interaction-deck'),
  z.literal('lesson-page'),
]);

export const subjectSchema = z.union([
  z.literal('math'),
  z.literal('physics'),
  z.literal('chemistry'),
  z.literal('biology'),
  z.literal('cs'),
  z.literal('other'),
]);

export const supportedInteractionTemplateSchema = z.literal('function-transform');

export const interactionEngineSchema = z.union([
  z.literal('svg'),
  z.literal('canvas'),
  z.literal('dom'),
]);

export const variableSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.literal('slider'),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  default: z.number(),
  meaning: z.string().optional(),
});

export const interactionSchema = z.object({
  template: supportedInteractionTemplateSchema,
  engine: interactionEngineSchema,
  formula: z.string().default('y = a(x - h)^2 + k'),
  variables: z.array(variableSchema).default([]),
});

export const storyboardActionSetSchema = z.object({
  set: z.record(z.string(), z.number()).optional(),
  animate: z.record(
    z.string(),
    z.object({ from: z.number(), to: z.number(), duration: z.number().positive() }),
  ).optional(),
});

export const storyboardStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  action: storyboardActionSetSchema,
  teacherScript: z.string().optional(),
});

export const conceptSpecSchema = z.object({
  schemaVersion: schemaVersionSchema,
  projectType: projectTypeSchema,
  subject: subjectSchema,
  grade: z.string().optional(),
  concept: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    learningGoals: z.array(z.string()).default([]),
    commonMisconceptions: z.array(z.string()).default([]),
  }),
  interaction: interactionSchema,
  storyboard: z.array(storyboardStepSchema).default([]),
  assessment: z.array(
    z.object({
      type: z.string().min(1),
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  ).default([]),
  theme: z
    .object({
      designSystem: z.string().default('math-minimal'),
      motionIntensity: z
        .union([z.literal('low'), z.literal('medium'), z.literal('high')])
        .default('medium'),
    })
    .default({
      designSystem: 'math-minimal',
      motionIntensity: 'medium',
    }),
});

export type SchemaVersion = z.infer<typeof schemaVersionSchema>;
export type ProjectType = z.infer<typeof projectTypeSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type SupportedInteractionTemplate = z.infer<typeof supportedInteractionTemplateSchema>;
export type InteractionEngine = z.infer<typeof interactionEngineSchema>;
export type ConceptVariable = z.infer<typeof variableSchema>;
export type ConceptInteraction = z.infer<typeof interactionSchema>;
export type StoryboardStep = z.infer<typeof storyboardStepSchema>;
export type ConceptSpec = z.infer<typeof conceptSpecSchema>;
