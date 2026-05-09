import React from 'react';
import { FunctionTransformInteraction } from '@superteacher/edu-components';
import type { ConceptSpec, PublishedLessonManifest } from '@superteacher/contracts';
import { requestPublishedConcept, requestPublishedManifest } from '../api/client';

export interface PublishedLessonPageProps {
  slug: string;
  onBack: () => void;
}

export function PublishedLessonPage({ slug, onBack }: PublishedLessonPageProps) {
  const [manifest, setManifest] = React.useState<PublishedLessonManifest | null>(null);
  const [spec, setSpec] = React.useState<ConceptSpec | null>(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    Promise.all([requestPublishedManifest(slug), requestPublishedConcept(slug)])
      .then(([nextManifest, nextSpec]) => {
        setManifest(nextManifest);
        setSpec(nextSpec);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : '发布课件加载失败'));
  }, [slug]);

  return (
    <main className="published-shell">
      <header className="present-toolbar">
        <button type="button" onClick={onBack}>返回工作台</button>
        <span>{manifest ? `已发布课件：${manifest.slug}` : '已发布课件'}</span>
      </header>
      {error && <p className="error-message">{error}</p>}
      {!spec && !error && <p className="loading-message">加载中...</p>}
      {spec && (
        <section className="present-stage">
          <FunctionTransformInteraction spec={spec} />
        </section>
      )}
    </main>
  );
}
