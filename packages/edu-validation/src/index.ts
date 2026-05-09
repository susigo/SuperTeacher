import { conceptSpecSchema, type ConceptSpec, type ValidationIssue } from '@superteacher/contracts';
import { createValidationIssue, hasBlockingErrors } from './errors';
import { validateFunctionTransformSpec } from './functionTransform';

export interface ConceptSpecValidationResult {
  success: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  data?: ConceptSpec;
}

function splitIssues(issues: ValidationIssue[]) {
  return {
    errors: issues.filter((issue) => issue.severity === 'error'),
    warnings: issues.filter((issue) => issue.severity === 'warning'),
  };
}

export function validateConceptSpec(input: unknown): ConceptSpecValidationResult {
  const parsed = conceptSpecSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) =>
      createValidationIssue('concept.schema', issue.path.join('.'), issue.message),
    );
    const { errors, warnings } = splitIssues(issues);
    return { success: false, errors, warnings, data: undefined };
  }

  const domainIssues = validateByTemplate(parsed.data);
  const { errors, warnings } = splitIssues(domainIssues);

  return {
    success: !hasBlockingErrors(domainIssues),
    errors,
    warnings,
    data: hasBlockingErrors(domainIssues) ? undefined : parsed.data,
  };
}

export function validateForPublish(input: unknown): ConceptSpecValidationResult {
  const result = validateConceptSpec(input);
  if (!result.data) {
    return result;
  }

  const publishIssues: ValidationIssue[] = [];

  if (result.data.storyboard.length === 0) {
    publishIssues.push(
      createValidationIssue(
        'publish.storyboard.required',
        'storyboard',
        '发布课件至少需要一个讲解步骤',
      ),
    );
  }

  if (result.data.assessment.length === 0) {
    publishIssues.push(
      createValidationIssue(
        'publish.assessment.required',
        'assessment',
        '发布课件至少需要一个课堂检查问题',
      ),
    );
  }

  const errors = [...result.errors, ...publishIssues.filter((issue) => issue.severity === 'error')];
  const warnings = [...result.warnings, ...publishIssues.filter((issue) => issue.severity === 'warning')];

  return {
    success: errors.length === 0,
    errors,
    warnings,
    data: errors.length === 0 ? result.data : undefined,
  };
}

function validateByTemplate(spec: ConceptSpec): ValidationIssue[] {
  if (spec.interaction.template === 'function-transform') {
    return validateFunctionTransformSpec(spec);
  }

  return [
    createValidationIssue(
      'concept.template.unsupported',
      'interaction.template',
      `不支持的互动模板：${spec.interaction.template}`,
    ),
  ];
}

export const validateConceptSpecStrict = (input: unknown): ConceptSpec => {
  const result = validateConceptSpec(input);
  if (!result.success || !result.data) {
    throw new Error(result.errors.map((issue) => `${issue.path}: ${issue.message}`).join('; '));
  }
  return result.data;
};

export const conceptSpecZodSchema = conceptSpecSchema;
export { validateFunctionTransformSpec };
export type { ValidationIssue } from '@superteacher/contracts';
