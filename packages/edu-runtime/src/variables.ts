import type { ConceptVariable } from '@superteacher/contracts';

export type RuntimeVariableValues = Record<string, number>;

export function getDefaultVariableValues(variables: ConceptVariable[]) {
  return variables.reduce<RuntimeVariableValues>((acc, item) => {
    acc[item.id] = item.default;
    return acc;
  }, {});
}

export function getVariableById(variables: ConceptVariable[], id: string) {
  return variables.find((variable) => variable.id === id);
}

export function clampVariableValue(variable: ConceptVariable | undefined, value: number) {
  if (!variable || Number.isNaN(value)) {
    return value;
  }

  return Math.min(variable.max, Math.max(variable.min, value));
}

export function clampVariableValues(variables: ConceptVariable[], values: RuntimeVariableValues) {
  return Object.entries(values).reduce<RuntimeVariableValues>((acc, [id, value]) => {
    acc[id] = clampVariableValue(getVariableById(variables, id), value);
    return acc;
  }, {});
}
