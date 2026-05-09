export interface FunctionTransformValues {
  a: number;
  h: number;
  k: number;
}

export function evaluateQuadratic({ a, h, k }: FunctionTransformValues, x: number) {
  return a * Math.pow(x - h, 2) + k;
}

export function toScreenX(x: number, width: number) {
  return ((x + 10) / 20) * width;
}

export function toScreenY(y: number, height: number) {
  return height / 2 - (y / 15) * height;
}

export function buildPathPoints(values: FunctionTransformValues, width: number, height: number) {
  const points: string[] = [];

  for (let i = 0; i <= 240; i += 1) {
    const t = i / 240;
    const x = -10 + 20 * t;
    const y = evaluateQuadratic(values, x);
    const screenX = toScreenX(x, width);
    const screenY = toScreenY(y, height);

    if (Number.isFinite(screenX) && Number.isFinite(screenY)) {
      points.push(`${screenX},${screenY}`);
    }
  }

  return points.join(' ');
}

export function describeTransform({ a, h, k }: FunctionTransformValues) {
  if (a === 0) {
    return 'a = 0 时图像退化，不再是二次函数抛物线';
  }

  const opening = a >= 0 ? '向上' : '向下';
  const width = Math.abs(a) > 1 ? '更窄' : Math.abs(a) < 1 ? '更宽' : '标准宽度';
  const horizontal = h === 0 ? '不水平平移' : h > 0 ? `向右 ${h}` : `向左 ${Math.abs(h)}`;
  const vertical = k === 0 ? '不垂直平移' : k > 0 ? `向上 ${k}` : `向下 ${Math.abs(k)}`;
  return `开口${opening}，${width}，${horizontal}，${vertical}`;
}
