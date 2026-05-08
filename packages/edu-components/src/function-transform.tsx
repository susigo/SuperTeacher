import React from 'react';
import { type ConceptSpec } from '@superteacher/contracts';

type FunctionTransformSpec = Extract<
  ConceptSpec['interaction'],
  { template: 'function-transform' }
>;

export interface FunctionTransformProps {
  spec: ConceptSpec;
  onVariableChange?: (values: Record<string, number>) => void;
}

function resolveAHK(values: Record<string, number>) {
  return {
    a: values.a ?? 1,
    h: values.h ?? 0,
    k: values.k ?? 0,
  };
}

function buildPathPoints(a: number, h: number, k: number, width: number, height: number) {
  const points = [];
  const xMin = -10;
  const xMax = 10;
  const pxPerUnitX = width / (xMax - xMin);
  const pxPerUnitY = height / 30;

  for (let i = 0; i <= 200; i += 1) {
    const t = i / 200;
    const x = xMin + (xMax - xMin) * t;
    const y = a * Math.pow(x - h, 2) + k;
    const px = (x - xMin) * pxPerUnitX;
    const py = height / 2 - y * pxPerUnitY;
    points.push(`${px},${py}`);
  }

  return points.join(' ');
}

export function FunctionTransformInteraction(props: FunctionTransformProps) {
  const { spec, onVariableChange } = props;
  const variableSignature = spec.interaction.variables
    .map((item) => `${item.id}:${item.default}`)
    .join('|');
  const [values, setValues] = React.useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    spec.interaction.variables.forEach((v) => {
      init[v.id] = v.default;
    });
    return init;
  });

  React.useEffect(() => {
    const next: Record<string, number> = {};
    spec.interaction.variables.forEach((v) => {
      next[v.id] = v.default;
    });
    setValues(next);
  }, [variableSignature]);

  const { a, h, k } = resolveAHK(values);
  const width = 520;
  const height = 320;
  const d = buildPathPoints(a, h, k, width, height);

  return (
    <section>
      <h3>{spec.concept.title}</h3>
      <p>{spec.concept.summary}</p>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: 560, border: '1px solid #d1d5db', background: '#f8fafc' }}>
        <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#d1d5db" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#d1d5db" />
        <polyline points={d} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      </svg>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {spec.interaction.variables.map((item) => (
          <label key={item.id} style={{ fontSize: 14, display: 'grid', gap: 4 }}>
            <span>{item.label}: {values[item.id]?.toFixed(1)}</span>
            <input
              type="range"
              min={item.min}
              max={item.max}
              step={item.step}
              value={values[item.id] ?? item.default}
              onChange={(event) => {
                const next = Number(event.target.value);
                setValues((prev) => {
                  const updated = { ...prev, [item.id]: next };
                  onVariableChange?.(updated);
                  return updated;
                });
              }}
            />
          </label>
        ))}
      </div>
      <p style={{ marginTop: 10 }}>y = a(x - h)² + k = {a.toFixed(2)}(x - {h.toFixed(2)})² + {k.toFixed(2)}</p>
    </section>
  );
}

export function isFunctionTransformSpec(
  interaction: ConceptSpec['interaction'],
): interaction is FunctionTransformSpec {
  return interaction.template === 'function-transform';
}
