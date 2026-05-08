import { type ConceptSpec, type ConceptVariable } from '@superteacher/contracts';

export interface RuntimeVariableValues {
  [key: string]: number;
}

export interface RuntimeState {
  spec: ConceptSpec;
  stepIndex: number;
  variableValues: RuntimeVariableValues;
  isPlaying: boolean;
}

export interface RuntimeActions {
  setVariable: (id: string, value: number) => void;
  setStep: (stepIndex: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export function getDefaultVariableValues(variables: ConceptVariable[]) {
  return variables.reduce<RuntimeVariableValues>(
    (acc, item) => {
      acc[item.id] = item.default;
      return acc;
    },
    {} as RuntimeVariableValues,
  );
}

export function createRuntime(spec: ConceptSpec): [RuntimeState, RuntimeActions] {
  const state: RuntimeState = {
    spec,
    stepIndex: 0,
    variableValues: getDefaultVariableValues(spec.interaction.variables),
    isPlaying: false,
  };

  const actions: RuntimeActions = {
    setVariable(id, value) {
      state.variableValues[id] = value;
    },
    setStep(stepIndex) {
      const safeIndex = Math.max(0, Math.min(stepIndex, spec.storyboard.length - 1));
      state.stepIndex = safeIndex;
    },
    nextStep() {
      if (state.stepIndex < spec.storyboard.length - 1) {
        state.stepIndex += 1;
      }
    },
    prevStep() {
      if (state.stepIndex > 0) {
        state.stepIndex -= 1;
      }
    },
    reset() {
      state.stepIndex = 0;
      state.variableValues = getDefaultVariableValues(spec.interaction.variables);
      state.isPlaying = false;
    },
  };

  return [state, actions];
}
