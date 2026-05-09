import { z } from 'zod';
import { conceptSpecSchema, variableSchema } from './concept';

export const functionTransformVariableIdSchema = z.union([
  z.literal('a'),
  z.literal('h'),
  z.literal('k'),
]);

export const functionTransformVariableSchema = variableSchema.extend({
  id: functionTransformVariableIdSchema,
});

export const functionTransformInteractionSchema = z.object({
  template: z.literal('function-transform'),
  engine: z.literal('svg'),
  formula: z.literal('y = a(x - h)^2 + k'),
  variables: z.array(functionTransformVariableSchema),
});

export const functionTransformSpecSchema = conceptSpecSchema.extend({
  subject: z.literal('math'),
  interaction: functionTransformInteractionSchema,
});

export type FunctionTransformVariableId = z.infer<typeof functionTransformVariableIdSchema>;
export type FunctionTransformVariable = z.infer<typeof functionTransformVariableSchema>;
export type FunctionTransformInteraction = z.infer<typeof functionTransformInteractionSchema>;
export type FunctionTransformSpec = z.infer<typeof functionTransformSpecSchema>;

export const requiredFunctionTransformVariableIds: FunctionTransformVariableId[] = ['a', 'h', 'k'];
