import type { ConceptSpec } from '@superteacher/contracts';
import {
  clampVariableValue,
  getDefaultVariableValues,
  getVariableById,
  type RuntimeVariableValues,
} from './variables';

export interface RuntimeState {
  spec: ConceptSpec;
  stepIndex: number;
  variableValues: RuntimeVariableValues;
  isPlaying: boolean;
}

export type RuntimeEvent =
  | { type: 'setVariable'; id: string; value: number }
  | { type: 'setVariables'; values: RuntimeVariableValues }
  | { type: 'setStep'; stepIndex: number; applyStep?: boolean }
  | { type: 'nextStep'; applyStep?: boolean }
  | { type: 'prevStep'; applyStep?: boolean }
  | { type: 'applyStep'; stepIndex?: number }
  | { type: 'setPlaying'; isPlaying: boolean }
  | { type: 'reset' };

export function createRuntimeState(spec: ConceptSpec): RuntimeState {
  return {
    spec,
    stepIndex: 0,
    variableValues: getDefaultVariableValues(spec.interaction.variables),
    isPlaying: false,
  };
}

export function reduceRuntimeState(state: RuntimeState, event: RuntimeEvent): RuntimeState {
  switch (event.type) {
    case 'setVariable': {
      const variable = getVariableById(state.spec.interaction.variables, event.id);
      return {
        ...state,
        variableValues: {
          ...state.variableValues,
          [event.id]: clampVariableValue(variable, event.value),
        },
      };
    }
    case 'setVariables': {
      return Object.entries(event.values).reduce(
        (nextState, [id, value]) => reduceRuntimeState(nextState, { type: 'setVariable', id, value }),
        state,
      );
    }
    case 'setStep': {
      const nextStepIndex = clampStepIndex(state.spec, event.stepIndex);
      const nextState = { ...state, stepIndex: nextStepIndex };
      return event.applyStep ? applyStoryboardStep(nextState, nextStepIndex) : nextState;
    }
    case 'nextStep': {
      return reduceRuntimeState(state, {
        type: 'setStep',
        stepIndex: state.stepIndex + 1,
        applyStep: event.applyStep,
      });
    }
    case 'prevStep': {
      return reduceRuntimeState(state, {
        type: 'setStep',
        stepIndex: state.stepIndex - 1,
        applyStep: event.applyStep,
      });
    }
    case 'applyStep': {
      return applyStoryboardStep(state, event.stepIndex ?? state.stepIndex);
    }
    case 'setPlaying': {
      return { ...state, isPlaying: event.isPlaying };
    }
    case 'reset': {
      return createRuntimeState(state.spec);
    }
    default: {
      return state;
    }
  }
}

export function applyStoryboardStep(state: RuntimeState, stepIndex: number): RuntimeState {
  const safeStepIndex = clampStepIndex(state.spec, stepIndex);
  const step = state.spec.storyboard[safeStepIndex];
  if (!step) {
    return { ...state, stepIndex: safeStepIndex };
  }

  const setValues: RuntimeVariableValues = { ...step.action.set };

  Object.entries(step.action.animate ?? {}).forEach(([id, animation]) => {
    setValues[id] = animation.to;
  });

  return reduceRuntimeState(
    { ...state, stepIndex: safeStepIndex },
    { type: 'setVariables', values: setValues },
  );
}

function clampStepIndex(spec: ConceptSpec, stepIndex: number) {
  if (spec.storyboard.length === 0) {
    return 0;
  }

  return Math.max(0, Math.min(stepIndex, spec.storyboard.length - 1));
}

export interface RuntimeActions {
  setVariable: (id: string, value: number) => RuntimeState;
  setStep: (stepIndex: number, applyStep?: boolean) => RuntimeState;
  nextStep: (applyStep?: boolean) => RuntimeState;
  prevStep: (applyStep?: boolean) => RuntimeState;
  applyStep: (stepIndex?: number) => RuntimeState;
  reset: () => RuntimeState;
}

export function createRuntime(spec: ConceptSpec): [RuntimeState, RuntimeActions] {
  let state = createRuntimeState(spec);

  const dispatch = (event: RuntimeEvent) => {
    state = reduceRuntimeState(state, event);
    return state;
  };

  return [
    state,
    {
      setVariable: (id, value) => dispatch({ type: 'setVariable', id, value }),
      setStep: (stepIndex, applyStep) => dispatch({ type: 'setStep', stepIndex, applyStep }),
      nextStep: (applyStep) => dispatch({ type: 'nextStep', applyStep }),
      prevStep: (applyStep) => dispatch({ type: 'prevStep', applyStep }),
      applyStep: (stepIndex) => dispatch({ type: 'applyStep', stepIndex }),
      reset: () => dispatch({ type: 'reset' }),
    },
  ];
}
