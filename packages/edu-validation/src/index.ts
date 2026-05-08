import { conceptSpecSchema, type ConceptSpec } from '@superteacher/contracts';

export interface ConceptSpecValidationResult {
  success: boolean;
  errors: Array<{ path: string; message: string }>;
  data?: ConceptSpec;
}

export function validateConceptSpec(input: unknown): ConceptSpecValidationResult {
  const parsed = conceptSpecSchema.safeParse(input);
  if (parsed.success) {
    return { success: true, errors: [], data: parsed.data };
  }

  const issues = parsed.error.issues ?? [];
  return {
    success: false,
    errors: issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
    data: undefined,
  };
}

export const validateConceptSpecStrict = (input: unknown): ConceptSpec => {
  return conceptSpecSchema.parse(input);
};

export const conceptSpecZodSchema = conceptSpecSchema;
