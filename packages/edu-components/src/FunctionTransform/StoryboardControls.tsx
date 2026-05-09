import type { StoryboardStep } from '@superteacher/contracts';

export interface StoryboardControlsProps {
  steps: StoryboardStep[];
  stepIndex: number;
  onSetStep: (stepIndex: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onReset: () => void;
}

export function StoryboardControls({
  steps,
  stepIndex,
  onSetStep,
  onPrevStep,
  onNextStep,
  onReset,
}: StoryboardControlsProps) {
  const currentStep = steps[stepIndex];

  return (
    <div className="storyboard-controls">
      <div className="playback-actions">
        <button type="button" onClick={onPrevStep} disabled={stepIndex <= 0}>上一步</button>
        <button type="button" onClick={onNextStep} disabled={stepIndex >= steps.length - 1}>下一步</button>
        <button type="button" onClick={onReset}>重置</button>
      </div>
      {currentStep && (
        <article className="current-step">
          <strong>{currentStep.title}</strong>
          <p>{currentStep.teacherScript}</p>
        </article>
      )}
      <div className="step-list">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={index === stepIndex ? 'active' : ''}
            onClick={() => onSetStep(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
