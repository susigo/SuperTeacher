import type { ConceptVariable } from '@superteacher/contracts';

export interface SliderPanelProps {
  variables: ConceptVariable[];
  values: Record<string, number>;
  onVariableChange: (id: string, value: number) => void;
}

export function SliderPanel({ variables, values, onVariableChange }: SliderPanelProps) {
  return (
    <div className="control-stack">
      {variables.map((item) => (
        <label key={item.id} className="runtime-slider">
          <span>
            <strong>{item.label}</strong>
            <small>{item.meaning}</small>
          </span>
          <input
            type="range"
            min={item.min}
            max={item.max}
            step={item.step}
            value={values[item.id] ?? item.default}
            onChange={(event) => onVariableChange(item.id, Number(event.target.value))}
          />
          <output>{(values[item.id] ?? item.default).toFixed(1)}</output>
        </label>
      ))}
    </div>
  );
}
