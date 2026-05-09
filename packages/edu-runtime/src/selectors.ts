import type { RuntimeState } from './runtime';

export function selectCurrentStep(state: RuntimeState) {
  return state.spec.storyboard[state.stepIndex];
}

export function selectFunctionTransformValues(state: RuntimeState) {
  return {
    a: state.variableValues.a ?? 1,
    h: state.variableValues.h ?? 0,
    k: state.variableValues.k ?? 0,
  };
}

export function selectIsDegenerateQuadratic(state: RuntimeState) {
  return selectFunctionTransformValues(state).a === 0;
}
