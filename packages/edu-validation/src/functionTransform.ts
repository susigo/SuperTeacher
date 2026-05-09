import {
  functionTransformSpecSchema,
  requiredFunctionTransformVariableIds,
  type ConceptSpec,
  type ValidationIssue,
} from '@superteacher/contracts';
import { createValidationIssue } from './errors';

export function validateFunctionTransformSpec(spec: ConceptSpec): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const parsed = functionTransformSpecSchema.safeParse(spec);

  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      issues.push(
        createValidationIssue(
          'function_transform.schema',
          issue.path.join('.'),
          issue.message,
        ),
      );
    });
    return issues;
  }

  const variables = parsed.data.interaction.variables;
  const variableById = new Map<string, (typeof variables)[number]>(variables.map((variable) => [variable.id, variable]));

  requiredFunctionTransformVariableIds.forEach((id) => {
    if (!variableById.has(id)) {
      issues.push(
        createValidationIssue(
          'function_transform.variable.required',
          `interaction.variables.${id}`,
          `function-transform 必须包含变量 ${id}`,
        ),
      );
    }
  });

  variables.forEach((variable, index) => {
    const path = `interaction.variables.${index}`;

    if (variable.min >= variable.max) {
      issues.push(
        createValidationIssue(
          'variable.range.invalid',
          `${path}.min`,
          `${variable.id} 的 min 必须小于 max`,
        ),
      );
    }

    if (variable.default < variable.min || variable.default > variable.max) {
      issues.push(
        createValidationIssue(
          'variable.default.out_of_range',
          `${path}.default`,
          `${variable.id} 的默认值必须落在 min/max 范围内`,
        ),
      );
    }

    if (variable.id === 'a' && variable.min <= 0 && variable.max >= 0) {
      issues.push(
        createValidationIssue(
          'function_transform.a.degenerate_allowed',
          `${path}.default`,
          'a 可经过 0；课堂 UI 必须提示此时退化，不再是抛物线',
          'warning',
        ),
      );
    }
  });

  const seenStepIds = new Set<string>();
  parsed.data.storyboard.forEach((step, stepIndex) => {
    if (seenStepIds.has(step.id)) {
      issues.push(
        createValidationIssue(
          'storyboard.id.duplicate',
          `storyboard.${stepIndex}.id`,
          `讲解步骤 id 重复：${step.id}`,
        ),
      );
    }
    seenStepIds.add(step.id);

    Object.entries(step.action.set ?? {}).forEach(([id, value]) => {
      const variable = variableById.get(id);
      if (!variable) {
        issues.push(
          createValidationIssue(
            'storyboard.action.variable_unknown',
            `storyboard.${stepIndex}.action.set.${id}`,
            `讲解步骤引用了不存在的变量 ${id}`,
          ),
        );
        return;
      }

      if (value < variable.min || value > variable.max) {
        issues.push(
          createValidationIssue(
            'storyboard.action.value_out_of_range',
            `storyboard.${stepIndex}.action.set.${id}`,
            `${id} 的步骤值必须落在 ${variable.min} 到 ${variable.max} 之间`,
          ),
        );
      }
    });

    Object.entries(step.action.animate ?? {}).forEach(([id, animation]) => {
      const variable = variableById.get(id);
      if (!variable) {
        issues.push(
          createValidationIssue(
            'storyboard.action.variable_unknown',
            `storyboard.${stepIndex}.action.animate.${id}`,
            `讲解步骤引用了不存在的变量 ${id}`,
          ),
        );
        return;
      }

      if (
        animation.from < variable.min ||
        animation.from > variable.max ||
        animation.to < variable.min ||
        animation.to > variable.max
      ) {
        issues.push(
          createValidationIssue(
            'storyboard.action.value_out_of_range',
            `storyboard.${stepIndex}.action.animate.${id}`,
            `${id} 的动画值必须落在 ${variable.min} 到 ${variable.max} 之间`,
          ),
        );
      }
    });
  });

  return issues;
}
