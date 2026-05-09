import type { GenerateSpecRequest, GenerateSpecResponse } from '@superteacher/contracts';
import { env } from '../config/env';

export async function aiGenerateSpec(_request: GenerateSpecRequest): Promise<GenerateSpecResponse> {
  if (!env.anthropicApiKey) {
    return {
      success: false,
      message: 'ANTHROPIC_API_KEY 未配置；当前只能使用 seed spec 和手动编辑。',
    };
  }

  return {
    success: false,
    message: 'AI 生成服务尚未接入，后续会只返回通过校验的 ConceptSpec JSON。',
  };
}
