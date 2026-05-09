import { createRuntimeState, reduceRuntimeState, type RuntimeEvent, type RuntimeState } from '@superteacher/edu-runtime';
import type { ConceptSpec } from '@superteacher/contracts';

export interface StudioState {
  spec: ConceptSpec | null;
  runtimeState: RuntimeState | null;
  status: string;
}

export function createStudioState(spec: ConceptSpec): StudioState {
  return {
    spec,
    runtimeState: createRuntimeState(spec),
    status: '已加载示例课件',
  };
}

export function updateRuntimeState(state: StudioState, event: RuntimeEvent): StudioState {
  if (!state.runtimeState) {
    return state;
  }

  return {
    ...state,
    runtimeState: reduceRuntimeState(state.runtimeState, event),
  };
}
