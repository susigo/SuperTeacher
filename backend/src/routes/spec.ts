import { Router } from 'express';
import { generateSpecRequestSchema } from '@superteacher/contracts';
import { functionTransformSeedSpec } from '@superteacher/edu-concepts';
import { validateConceptSpec } from '@superteacher/edu-validation';
import { getDefaultVariableValues } from '@superteacher/edu-runtime';
import { aiGenerateSpec } from '../services/aiGenerateSpec';

export const specRouter = Router();

specRouter.get('/spec/seed/function-transform', (_req, res) => {
  res.json(functionTransformSeedSpec);
});

specRouter.post('/spec/validate', (req, res) => {
  const result = validateConceptSpec(req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({
    ...result,
    defaults: getDefaultVariableValues(result.data?.interaction.variables || []),
  });
});

specRouter.post('/spec/generate', async (req, res) => {
  const parsed = generateSpecRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((issue) => issue.message).join('; '),
    });
  }

  const result = await aiGenerateSpec(parsed.data);
  return res.status(result.success ? 200 : 501).json(result);
});

specRouter.post('/spec/repair', (_req, res) => {
  return res.status(501).json({
    success: false,
    message: 'spec repair 尚未接入。',
  });
});

specRouter.get('/runtime/defaults/:specTemplate', (req, res) => {
  const template = req.params.specTemplate;
  if (template !== 'function-transform') {
    return res.status(404).json({ message: 'template unsupported' });
  }

  const defaults = getDefaultVariableValues(functionTransformSeedSpec.interaction.variables);
  return res.json({ specTemplate: template, defaults });
});
