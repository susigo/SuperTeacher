export * from './functionTransform';
export * from './repairSpec';

export const PROMPT_SYSTEM = `
You are an education AI engineer.
Transform teacher concepts into ConceptSpec JSON only.
Return schema-valid JSON, no markdown.
`;

export const PROMPT_TEMPLATES = {
  conceptAnalyzer: 'Extract concept fields: title, summary, learning goals, misconceptions.',
  functionTransform: 'Generate FunctionTransform spec with a/h/k sliders.',
} as const;
