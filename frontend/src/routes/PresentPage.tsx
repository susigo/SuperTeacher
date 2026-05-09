import { FunctionTransformInteraction } from '@superteacher/edu-components';
import type { ConceptSpec } from '@superteacher/contracts';
import type { RuntimeState } from '@superteacher/edu-runtime';

export interface PresentPageProps {
  spec: ConceptSpec;
  runtimeState: RuntimeState;
  onRuntimeStateChange: (state: RuntimeState) => void;
  onBack: () => void;
}

export function PresentPage({ spec, runtimeState, onRuntimeStateChange, onBack }: PresentPageProps) {
  return (
    <main className="present-shell">
      <header className="present-toolbar">
        <button type="button" onClick={onBack}>返回工作台</button>
        <span>授课演示模式</span>
      </header>
      <section className="present-stage">
        <FunctionTransformInteraction
          spec={spec}
          runtimeState={runtimeState}
          onRuntimeStateChange={onRuntimeStateChange}
        />
      </section>
    </main>
  );
}
