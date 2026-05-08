import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { validateConceptSpec } from '@superteacher/edu-validation';
import { getDefaultVariableValues } from '@superteacher/edu-runtime';
import type { ConceptSpec } from '@superteacher/contracts';

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const sampleFunctionTransformSpec: ConceptSpec = {
  schemaVersion: '0.1.0',
  projectType: 'concept-card',
  subject: 'math',
  grade: 'middle',
  concept: {
    title: '二次函数图像变换',
    summary: '通过 a/h/k 三个参数理解抛物线开口、左右和上下平移。',
    learningGoals: ['理解 a 对开口与收缩放大', '理解 h 对平移影响', '理解 k 对上下平移影响'],
    commonMisconceptions: ['把 h 当成拉伸因子', '忽略 k 对顶点高度的影响'],
  },
  interaction: {
    template: 'function-transform',
    engine: 'svg',
    formula: 'y = a(x-h)^2 + k',
    variables: [
      { id: 'a', label: 'a', type: 'slider', min: -3, max: 3, step: 0.1, default: 1, meaning: '开口与拉伸' },
      { id: 'h', label: 'h', type: 'slider', min: -5, max: 5, step: 0.5, default: 0, meaning: '水平平移' },
      { id: 'k', label: 'k', type: 'slider', min: -5, max: 5, step: 0.5, default: 0, meaning: '垂直平移' },
    ],
  },
  storyboard: [
    {
      id: 's1',
      title: '基础形态',
      action: { set: { a: 1, h: 0, k: 0 } },
      teacherScript: '默认抛物线 y = x²',
    },
  ],
  assessment: [
    {
      type: 'concept-check',
      question: 'h 增大时，图像如何变化？',
      answer: '向右移动',
    },
  ],
  theme: {
    designSystem: 'math-minimal',
    motionIntensity: 'medium',
  },
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'superteacher-backend' });
});

app.get('/api/v1/spec/seed/function-transform', (_req, res) => {
  res.json(sampleFunctionTransformSpec);
});

app.post('/api/v1/spec/validate', (req, res) => {
  const result = validateConceptSpec(req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({ ...result, defaults: getDefaultVariableValues(result.data?.interaction.variables || []) });
});

app.get('/api/v1/runtime/defaults/:specTemplate', (req, res) => {
  const template = req.params.specTemplate;
  if (template !== 'function-transform') {
    return res.status(404).json({ message: 'template unsupported' });
  }

  const defaults = getDefaultVariableValues(sampleFunctionTransformSpec.interaction.variables);
  return res.json({ specTemplate: template, defaults });
});

app.listen(PORT, () => {
  console.log(`backend listening on ${PORT}`);
});
