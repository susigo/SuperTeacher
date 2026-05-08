import React from 'react';
import { FunctionTransformInteraction } from '@superteacher/edu-components';
import type { ConceptSpec } from '@superteacher/contracts';

const API_ROOT = '/api/v1';

async function requestDefaultSpec() {
  const response = await fetch(`${API_ROOT}/spec/seed/function-transform`);
  if (!response.ok) {
    throw new Error('seed spec fetch failed');
  }
  return response.json() as Promise<ConceptSpec>;
}

function App() {
  const [spec, setSpec] = React.useState<ConceptSpec | null>(null);
  const [error, setError] = React.useState('');
  const [status, setStatus] = React.useState('未保存');
  const [prompt, setPrompt] = React.useState('初中二次函数 y=a(x-h)^2+k 的图像变换');

  React.useEffect(() => {
    requestDefaultSpec()
      .then(setSpec)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : '请求失败');
      });
  }, []);

  const updateConcept = (patch: Partial<ConceptSpec['concept']>) => {
    setSpec((current) => current ? { ...current, concept: { ...current.concept, ...patch } } : current);
    setStatus('有未保存更改');
  };

  const updateVariable = (id: string, value: number) => {
    setSpec((current) => {
      if (!current) return current;
      return {
        ...current,
        interaction: {
          ...current.interaction,
          variables: current.interaction.variables.map((item) =>
            item.id === id ? { ...item, default: value } : item,
          ),
        },
      };
    });
    setStatus('有未保存更改');
  };

  const validateSpec = async () => {
    if (!spec) return;
    const response = await fetch(`${API_ROOT}/spec/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spec),
    });
    setStatus(response.ok ? '校验通过' : '校验失败');
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
          <button type="button" onClick={validateSpec}>校验</button>
          <button type="button" className="primary">发布预览</button>
        </div>
      </header>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {!spec && !error && <p>加载中…</p>}

      {spec && (
        <section className="studio-grid">
          <aside className="concept-panel">
            <div className="panel-heading">
              <strong>概念输入</strong>
              <span>Concept</span>
            </div>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={7}
            />
            <button type="button" className="wide primary" onClick={() => setStatus('已生成草稿')}>
              生成互动课件
            </button>

            <div className="field-stack">
              <label>
                标题
                <input
                  value={spec.concept.title}
                  onChange={(event) => updateConcept({ title: event.target.value })}
                />
              </label>
              <label>
                摘要
                <textarea
                  value={spec.concept.summary}
                  onChange={(event) => updateConcept({ summary: event.target.value })}
                  rows={4}
                />
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
                    onChange={(event) => updateVariable(item.id, Number(event.target.value))}
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
              {spec.storyboard.map((step) => (
                <article key={step.id}>
                  <strong>{step.title}</strong>
                  <p>{step.teacherScript}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="preview-panel">
            <div className="panel-heading">
              <strong>课堂预览</strong>
              <span>Runtime</span>
            </div>
            {spec.interaction.template === 'function-transform' && (
              <FunctionTransformInteraction
                spec={spec}
                onVariableChange={(values) => {
                  Object.entries(values).forEach(([id, value]) => updateVariable(id, value));
                }}
              />
            )}
          </section>
        </section>
      )}
    </main>
  );
}

export default App;
