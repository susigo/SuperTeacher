# SuperTeacher

SuperTeacher is an AI interactive courseware product for turning abstract teaching concepts into browser-based interactive demonstrations.

## Product direction

Do **not** build another AI PPT generator. The core product direction is **Concept-to-Interaction**:

```text
teacher concept input -> structured teaching spec -> stable education runtime -> interactive browser lesson
```

The first target users are teachers and creators who need visual, manipulable explanations for math, physics, STEM, public lessons, teaching competitions, tutoring, and educational short videos.

## Core technical principle

AI should generate structured educational specs, not arbitrary frontend code.

The default trusted path is:

```text
AI -> ConceptSpec JSON -> schema/domain validation -> official Edu Runtime -> published browser page
```

Free-form HTML/CSS/JS generation may be explored later as a sandboxed creative path, but classroom-facing content should use validated specs and stable components.

## Current implementation strategy

This repository is the main SuperTeacher product codebase. `reference/open-design/` is a cloned reference project, not the primary app to modify directly.

Use Open Design as a reference for:

- chat + artifact workspace patterns
- skill/manifest design ideas
- preview and artifact lifecycle ideas
- design-system inspiration

Do not assume SuperTeacher should directly fork or deeply couple itself to Open Design unless explicitly decided later.

## Engineering direction

Prefer a maintainable TypeScript monorepo with clear boundaries:

```text
frontend/                 # Teacher studio, presenter mode, published pages
backend/                  # API, AI orchestration, projects, publishing, validation
packages/contracts/       # ConceptSpec, API types, shared Zod schemas
packages/edu-runtime/     # playback, variables, storyboard, runtime state
packages/edu-components/  # reusable teaching interaction components
packages/edu-validation/  # schema and domain validation
packages/prompts/         # versioned AI prompts
reference/open-design/    # reference only
```

The first real component should be a high-quality `function-transform` interaction for quadratic functions, supporting `a/h/k` sliders, graph rendering, vertex annotation, and storyboard playback.

## MVP scope

Build one robust engineering loop before expanding templates:

1. Define `ConceptSpec v0.1` and `FunctionTransformSpec`.
2. Implement Zod validation and shared contracts.
3. Implement the Edu Runtime playback model.
4. Implement the quadratic function transform component.
5. Build a minimal teacher studio and preview page.
6. Add AI generation that outputs validated specs only.
7. Add presenter mode and immutable published pages.
8. Add Playwright smoke tests for preview, controls, and published pages.

Avoid early scope creep: no PPTX export, no Electron app, no broad multi-subject coverage, no production reliance on AI-generated arbitrary code.

## Deployment target

The project is hosted on GitHub and should be deployable to an Ubuntu VPS with simple scripts.

Target operator flow:

```bash
git clone <repo-url>
cd SuperTeacher
cp .env.example .env
# edit .env
bash scripts/install.sh
bash scripts/start.sh
```

Recommended production stack:

- Docker Compose
- Caddy for HTTPS and reverse proxy
- frontend service
- backend service
- Postgres
- local storage volume for published artifacts and uploads
- Redis later for queues/rate limits/video export

Expected deployment files:

```text
deploy/docker-compose.yml
deploy/caddy/Caddyfile
scripts/install.sh
scripts/start.sh
scripts/update.sh
scripts/logs.sh
scripts/backup.sh
scripts/healthcheck.sh
.env.example
Dockerfile.frontend
Dockerfile.backend
```

Published lessons should be immutable artifacts, for example:

```text
storage/published/{slug}/
├── manifest.json
├── concept.json
├── assets/
└── snapshots/
```

## Important docs

- Product plan: `docs/AI_interactive_courseware_product_plan.extracted.txt`
- Reference project: `reference/open-design/`
- Open Design architecture reference: `reference/open-design/docs/architecture.md`
- Open Design skills protocol reference: `reference/open-design/docs/skills-protocol.md`
