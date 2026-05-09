import React from 'react';
import type { ConceptSpec } from '@superteacher/contracts';
import type { RuntimeState } from '@superteacher/edu-runtime';
import { StudioPage } from './routes/StudioPage';
import { PresentPage } from './routes/PresentPage';
import { PublishedLessonPage } from './routes/PublishedLessonPage';

type AppRoute =
  | { name: 'studio' }
  | { name: 'present'; spec: ConceptSpec; runtimeState: RuntimeState }
  | { name: 'published'; slug: string };

function getInitialRoute(): AppRoute {
  const publishedMatch = window.location.pathname.match(/^\/p\/([^/]+)$/);
  if (publishedMatch?.[1]) {
    return { name: 'published', slug: publishedMatch[1] };
  }

  return { name: 'studio' };
}

function App() {
  const [route, setRoute] = React.useState<AppRoute>(() => getInitialRoute());

  const goStudio = () => {
    window.history.pushState(null, '', '/');
    setRoute({ name: 'studio' });
  };

  if (route.name === 'present') {
    return (
      <PresentPage
        spec={route.spec}
        runtimeState={route.runtimeState}
        onRuntimeStateChange={(runtimeState) => setRoute({ ...route, runtimeState })}
        onBack={goStudio}
      />
    );
  }

  if (route.name === 'published') {
    return <PublishedLessonPage slug={route.slug} onBack={goStudio} />;
  }

  return (
    <StudioPage
      onPresent={(spec, runtimeState) => setRoute({ name: 'present', spec, runtimeState })}
      onPublished={(slug) => {
        window.history.pushState(null, '', `/p/${slug}`);
        setRoute({ name: 'published', slug });
      }}
    />
  );
}

export default App;
