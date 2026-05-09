import React from 'react';
import { FunctionTransformInteraction } from '@superteacher/edu-components';
import { createRuntimeState, reduceRuntimeState, type RuntimeState } from '@superteacher/edu-runtime';
import type { ConceptSpec, ValidateSpecResponse } from '@superteacher/contracts';
import { publishSpec, requestDefaultSpec, validateSpec } from '../api/client';

export interface StudioPageProps {
  onPresent: (spec: ConceptSpec, runtimeState: RuntimeState) => void;
  onPublished: (slug: string) => void;
}

export function StudioPage({ onPresent, onPublished }: StudioPageProps) {
  const [spec, setSpec] = React.useState<ConceptSpec | null>(null);
  const [runtimeState, setRuntimeState] = React.useState<RuntimeState | null>(null);
  const [error, setError] = React.useState('');
  const [status, setStatus] = React.useState('未保存');
  const [prompt, setPrompt] = React.useState('初中二次函数 y = a(x - h)^2 + k 的图像变换');
  const [validation, setValidation] = React.useState<ValidateSpecResponse | null>(null);

  React.useEffect(() => {
    requestDefaultSpec()
      .then((nextSpec) => {
        setSpec(nextSpec);
        setRuntimeState(createRuntimeState(nextSpec));
        setStatus('已加载示例课件');
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : '请求失败');
      });
  }, []);

  const updateConcept = (patch: Partial<ConceptSpec['concept']>) => {
    setSpec((current) => {
      if (!current) return current;
      const nextSpec = { ...current, concept: { ...current.concept, ...patch } };
      setRuntimeState((currentRuntime) => currentRuntime ? { ...currentRuntime, spec: nextSpec } : createRuntimeState(nextSpec));
      return nextSpec;
    });
    setStatus('有未保存更改');
  };

  const updateVariableDefault = (id: string, value: number) => {
    setSpec((current) => {
      if (!current) return current;
      const nextSpec = {
        ...current,
        interaction: {
          ...current.interaction,
          variables: current.interaction.variables.map((item) =>
            item.id === id ? { ...item, default: value } : item,
          ),
        },
      };
      setRuntimeState(createRuntimeState(nextSpec));
      return nextSpec;
    });
    setStatus('有未保存更改');
  };

  const applyStoryboardStep = (stepIndex: number) => {
    setRuntimeState((current) => current ? reduceRuntimeState(current, { type: 'setStep', stepIndex, applyStep: true }) : current);
    setStatus(`已应用步骤 ${stepIndex + 1}`);
  };

  const handleValidate = async () => {
    if (!spec) return;
    const result = await validateSpec(spec);
    setValidation(result);
    setStatus(result.success ? '校验通过' : '校验失败');
  };

  const handlePublish = async () => {
    if (!spec) return;
    const result = await publishSpec(spec);
    setStatus(result.success && result.slug ? `已发布 ${result.slug}` : '发布失败');
    if (result.slug) {
      onPublished(result.slug);
    }
  };

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div>
          <h1>SuperTeacher</h1>
          <p>教师工作台</p>
        </div>
        <div className="topbar-actions">
          <span>{status}</span>
          <button type="button" onClick={handleValidate}>校验</button>
          <button type="button" onClick={() => spec && runtimeState && onPresent(spec, runtimeState)}>演示模式</button>
          <button type="button" className="primary" onClick={handlePublish}>发布预览</button>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}
      {!spec && !error && <p className="loading-message">加载中...</p>}

      {spec && runtimeState && (
        <section className="studio-grid">
          <aside className="concept-panel">
            <div className="panel-heading">
              <strong>概念输入</strong>
              <span>Concept</span>
            </div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} />
            <button type="button" className="wide primary" onClick={() => setStatus('AI 生成待接入')}>
              生成互动课件
            </button>

            <div className="field-stack">
              <label>
                标题
                <input value={spec.concept.title} onChange={(event) => updateConcept({ title: event.target.value })} />
              </label>
              <label>
                摘要
                <textarea value={spec.concept.summary} onChange={(event) => updateConcept({ summary: event.target.value })} rows={4} />
              </label>
            </div>
          </aside>

          <section className="editor-panel">
            <div className="panel-heading">
              <strong>结构化编辑</strong>
              <span>{spec.interaction.template}</span>
            </div>
            <div className="variable-grid">
              {spec.interaction.variables.map((item) => (
                <label key={item.id} className="variable-row">
                  <span>{item.label}</span>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={item.default}
                    onChange={(event) => updateVariableDefault(item.id, Number(event.target.value))}
                  />
                  <output>{item.default.toFixed(1)}</output>
                </label>
              ))}
            </div>

            <div className="storyboard">
              <div className="panel-heading">
                <strong>讲解步骤</strong>
                <span>{spec.storyboard.length} steps</span>
              </div>
              {spec.storyboard.map((step, index) => (
                <article key={step.id}>
                  <button type="button" onClick={() => applyStoryboardStep(index)}>{index + 1}</button>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.teacherScript}</p>
                  </div>
                </article>
              ))}
            </div>

            {validation && (
              <div className={validation.success ? 'validation-card success' : 'validation-card error'}>
                <strong>{validation.success ? '校验通过' : '校验失败'}</strong>
                {[...validation.errors, ...validation.warnings].map((issue) => (
                  <p key={`${issue.code}-${issue.path}`}>{issue.path}: {issue.message}</p>
                ))}
              </div>
            )}

            <details className="json-inspector">
              <summary>查看 concept.json</summary>
              <pre>{JSON.stringify(spec, null, 2)}</pre>
            </details>
          </section>

          <section className="preview-panel">
            <div className="panel-heading">
              <strong>课堂预览</strong>
              <span>Runtime</span>
            </div>
            <FunctionTransformInteraction
              spec={spec}
              runtimeState={runtimeState}
              onRuntimeStateChange={setRuntimeState}
            />
          </section>
        </section>
      )}
    </main>
  );
}
