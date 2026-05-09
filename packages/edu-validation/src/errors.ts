import type { ValidationIssue } from '@superteacher/contracts';

export function createValidationIssue(
  code: string,
  path: string,
  message: string,
  severity: ValidationIssue['severity'] = 'error',
): ValidationIssue {
  return { code, path, message, severity };
}

export function hasBlockingErrors(issues: ValidationIssue[]) {
  return issues.some((issue) => issue.severity === 'error');
}
