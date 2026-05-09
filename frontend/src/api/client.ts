import type { ConceptSpec, PublishedLessonManifest, PublishLessonResponse, ValidateSpecResponse } from '@superteacher/contracts';

const API_ROOT = '/api/v1';

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message ?? data?.errors?.[0]?.message ?? '请求失败');
  }
  return data as T;
}

export async function requestDefaultSpec() {
  const response = await fetch(`${API_ROOT}/spec/seed/function-transform`);
  return parseJsonResponse<ConceptSpec>(response);
}

export async function validateSpec(spec: ConceptSpec) {
  const response = await fetch(`${API_ROOT}/spec/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spec),
  });
  return parseJsonResponse<ValidateSpecResponse>(response);
}

export async function publishSpec(spec: ConceptSpec) {
  const response = await fetch(`${API_ROOT}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spec),
  });
  return parseJsonResponse<PublishLessonResponse>(response);
}

export async function requestPublishedManifest(slug: string) {
  const response = await fetch(`${API_ROOT}/published/${slug}/manifest`);
  return parseJsonResponse<PublishedLessonManifest>(response);
}

export async function requestPublishedConcept(slug: string) {
  const response = await fetch(`${API_ROOT}/published/${slug}/concept`);
  return parseJsonResponse<ConceptSpec>(response);
}
