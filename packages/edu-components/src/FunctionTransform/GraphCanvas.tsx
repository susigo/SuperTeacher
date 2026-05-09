import React from 'react';
import { buildPathPoints, toScreenX, toScreenY, type FunctionTransformValues } from './math';

export interface GraphCanvasProps {
  values: FunctionTransformValues;
}

export function GraphCanvas({ values }: GraphCanvasProps) {
  const { a, h, k } = values;
  const width = 640;
  const height = 390;
  const curvePoints = buildPathPoints(values, width, height);
  const basePoints = buildPathPoints({ a: 1, h: 0, k: 0 }, width, height);
  const vertexX = toScreenX(h, width);
  const vertexY = toScreenY(k, height);
  const isDegenerate = a === 0;

  return (
    <div className="graph-shell">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="二次函数图像">
        <rect x="0" y="0" width={width} height={height} fill="#f8fafc" />
        {Array.from({ length: 21 }, (_, index) => index - 10).map((tick) => (
          <React.Fragment key={`grid-${tick}`}>
            <line x1={toScreenX(tick, width)} y1="0" x2={toScreenX(tick, width)} y2={height} stroke="#e5e7eb" />
            <line x1="0" y1={toScreenY(tick, height)} x2={width} y2={toScreenY(tick, height)} stroke="#e5e7eb" />
          </React.Fragment>
        ))}
        <line x1={toScreenX(0, width)} y1="0" x2={toScreenX(0, width)} y2={height} stroke="#98a2b3" strokeWidth="1.5" />
        <line x1="0" y1={toScreenY(0, height)} x2={width} y2={toScreenY(0, height)} stroke="#98a2b3" strokeWidth="1.5" />
        <polyline points={basePoints} fill="none" stroke="#94a3b8" strokeDasharray="7 7" strokeWidth="2" />
        <polyline points={curvePoints} fill="none" stroke={isDegenerate ? '#f97316' : '#2563eb'} strokeWidth="3" strokeLinejoin="round" />
        <line x1={vertexX} y1={vertexY} x2={vertexX} y2={toScreenY(0, height)} stroke="#176b5b" strokeDasharray="4 5" />
        <circle cx={vertexX} cy={vertexY} r="6" fill="#176b5b" />
        <text x={Math.min(vertexX + 10, width - 120)} y={Math.max(vertexY - 12, 22)} fill="#176b5b" fontSize="15">
          顶点 ({h.toFixed(1)}, {k.toFixed(1)})
        </text>
        <text x={width - 24} y={toScreenY(0, height) - 8} fill="#667085" fontSize="13">x</text>
        <text x={toScreenX(0, width) + 8} y="18" fill="#667085" fontSize="13">y</text>
      </svg>
      {isDegenerate && <p className="runtime-warning">a = 0 时图像退化为水平线，不再是抛物线。</p>}
    </div>
  );
}
