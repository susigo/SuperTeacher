import React from 'react';
import { reduceRuntimeState, createRuntimeState, selectFunctionTransformValues, type RuntimeState } from '@superteacher/edu-runtime';
import { type ConceptSpec } from '@superteacher/contracts';
import { GraphCanvas } from './GraphCanvas';
import { SliderPanel } from './SliderPanel';
import { StoryboardControls } from './StoryboardControls';
import { describeTransform } from './math';

export interface FunctionTransformProps {
  spec: ConceptSpec;
  runtimeState?: RuntimeState;
  onRuntimeStateChange?: (state: RuntimeState) => void;
}

export function FunctionTransformInteraction(props: FunctionTransformProps) {
  const { spec, runtimeState, onRuntimeStateChange } = props;
  const [internalState, setInternalState] = React.useState(() => createRuntimeState(spec));
  const state = runtimeState ?? internalState;

  React.useEffect(() => {
    const nextState = createRuntimeState(spec);
    setInternalState(nextState);
    onRuntimeStateChange?.(nextState);
  }, [spec, onRuntimeStateChange]);

  const dispatch = React.useCallback(
    (event: Parameters<typeof reduceRuntimeState>[1]) => {
      const nextState = reduceRuntimeState(state, event);
      if (!runtimeState) {
        setInternalState(nextState);
      }
      onRuntimeStateChange?.(nextState);
    },
    [onRuntimeStateChange, runtimeState, state],
  );

  const values = selectFunctionTransformValues(state);

  return (
    <section className="function-transform">
      <header className="lesson-header">
        <div>
          <h2>{spec.concept.title}</h2>
          <p>{spec.concept.summary}</p>
        </div>
        <div className="formula-chip">
          y = {values.a.toFixed(1)}(x - {values.h.toFixed(1)})^2 + {values.k.toFixed(1)}
        </div>
      </header>

      <GraphCanvas values={values} />

      <div className="runtime-grid">
        <SliderPanel
          variables={spec.interaction.variables}
          values={state.variableValues}
          onVariableChange={(id, value) => dispatch({ type: 'setVariable', id, value })}
        />

        <aside className="teaching-notes">
          <strong>当前观察</strong>
          <p>{describeTransform(values)}</p>
          <strong>学习目标</strong>
          <ul>
            {spec.concept.learningGoals.slice(0, 3).map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </aside>
      </div>

      <StoryboardControls
        steps={spec.storyboard}
        stepIndex={state.stepIndex}
        onSetStep={(stepIndex) => dispatch({ type: 'setStep', stepIndex, applyStep: true })}
        onPrevStep={() => dispatch({ type: 'prevStep', applyStep: true })}
        onNextStep={() => dispatch({ type: 'nextStep', applyStep: true })}
        onReset={() => dispatch({ type: 'reset' })}
      />
    </section>
  );
}
