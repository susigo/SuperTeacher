import type { ConceptSpec } from '@superteacher/contracts';

export const functionTransformSeedSpec: ConceptSpec = {
  schemaVersion: '0.1.0',
  projectType: 'concept-card',
  subject: 'math',
  grade: 'middle',
  concept: {
    title: '二次函数图像变换',
    summary: '通过 a、h、k 三个参数，观察 y = a(x - h)^2 + k 的开口、左右平移和上下平移。',
    learningGoals: [
      '理解 a 决定抛物线开口方向和宽窄',
      '理解 h 决定顶点的水平位置',
      '理解 k 决定顶点的垂直位置',
      '能从顶点式判断抛物线的关键特征',
    ],
    commonMisconceptions: [
      '把 h 的符号看反，以为 h 增大时图像向左移动',
      '只关注开口方向，忽略 |a| 对图像宽窄的影响',
      '把 k 当作整体高度变化，而没有连接到顶点坐标',
    ],
  },
  interaction: {
    template: 'function-transform',
    engine: 'svg',
    formula: 'y = a(x - h)^2 + k',
    variables: [
      { id: 'a', label: 'a', type: 'slider', min: -3, max: 3, step: 0.1, default: 1, meaning: '开口方向与宽窄' },
      { id: 'h', label: 'h', type: 'slider', min: -5, max: 5, step: 0.5, default: 0, meaning: '水平平移' },
      { id: 'k', label: 'k', type: 'slider', min: -5, max: 5, step: 0.5, default: 0, meaning: '垂直平移' },
    ],
  },
  storyboard: [
    {
      id: 's1',
      title: '从母函数开始',
      action: { set: { a: 1, h: 0, k: 0 } },
      teacherScript: '先观察 y = x^2。顶点在原点，开口向上，这是后续变换的参照物。',
    },
    {
      id: 's2',
      title: '改变 a：开口与宽窄',
      action: { set: { a: -1.5, h: 0, k: 0 } },
      teacherScript: '当 a 为负数时，开口向下；|a| 越大，图像越窄。',
    },
    {
      id: 's3',
      title: '改变 h：左右平移',
      action: { set: { a: 1, h: 2, k: 0 } },
      teacherScript: '顶点从 (0, 0) 移到 (2, 0)。注意顶点式里是 x - h，所以 h 增大时图像向右移动。',
    },
    {
      id: 's4',
      title: '改变 k：上下平移',
      action: { set: { a: 1, h: 2, k: -2 } },
      teacherScript: 'k 改变顶点的纵坐标。现在顶点是 (2, -2)，整条抛物线随顶点向下移动。',
    },
  ],
  assessment: [
    {
      type: 'concept-check',
      question: '在 y = 2(x - 3)^2 - 1 中，顶点坐标是什么？',
      answer: '(3, -1)',
    },
    {
      type: 'concept-check',
      question: '当 h 从 0 变到 4 时，图像向哪个方向移动？',
      answer: '向右移动',
    },
  ],
  theme: {
    designSystem: 'math-minimal',
    motionIntensity: 'medium',
  },
};
