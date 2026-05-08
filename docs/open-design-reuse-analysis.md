# Open Design Reuse Analysis

## Current conclusion

SuperTeacher should reuse Open Design as the product workbench base, not just as UI inspiration.

The current `frontend/` Vite editor is useful only as a throwaway prototype for `ConceptSpec` and `FunctionTransform`. It should not become the long-term product shell.

## What Open Design already gives us

Open Design is a full local-first artifact workbench:

- `apps/web`: Next.js app shell with project entry, chat pane, file workspace, iframe preview, comments, manual edit mode, project tabs, settings, examples, and export UI.
- `apps/daemon`: Express daemon with projects, conversations, messages, skills, design systems, file storage, uploads, artifact serving, deploy hooks, provider proxying, and streaming chat.
- `packages/contracts`: shared API and event contracts between web and daemon.
- `packages/platform`, `packages/sidecar`, `packages/sidecar-proto`: process/runtime support for desktop and daemon integration.
- `skills/`: OD-compatible skill library with `SKILL.md` front matter, examples, templates, design-system and craft integration.
- `craft/`: reusable quality rules for generated artifacts.

This is much more than a frontend layout. Rebuilding these parts in SuperTeacher would duplicate months of engineering.

## Reuse map

| SuperTeacher need | Open Design module to reuse | Reuse level |
| --- | --- | --- |
| Teacher concept input + iterative generation | `apps/web/src/components/ChatPane.tsx`, `ChatComposer`, project conversations | Direct reuse with copy and domain wording changes |
| Artifact/file workspace | `FileWorkspace`, `DesignFilesPanel`, tab persistence | Direct reuse |
| Sandboxed preview | `FileViewer`, `runtime/srcdoc.ts`, `runtime/react-component.ts`, `runtime/exports.ts` | Direct reuse, add `concept-spec` renderer |
| Project persistence | `apps/daemon/src/db.ts`, `projects.ts`, project/conversation routes | Direct reuse, add education metadata fields |
| Skill registry | `apps/daemon/src/skills.ts`, `skills-protocol.md` | Direct reuse, add `edu-concept-card` skill |
| Design system/craft injection | `design-systems.ts`, `craft.ts`, `prompts/system.ts` | Direct reuse, add classroom visual systems |
| Agent streaming | `providers/daemon.ts`, daemon `/api/chat` stream | Direct reuse, constrain prompts to `ConceptSpec` |
| Comments/manual refinement | comment bridge, inspect/manual edit bridge | Reuse later after runtime preview is stable |
| Deploy/export | deployment hooks, HTML/PDF/ZIP export | Reuse later; published lessons need a stricter immutable path |

## What should remain SuperTeacher-specific

These should not be inherited from Open Design:

- `ConceptSpec` schema and versioning.
- Domain validation for math/physics concepts.
- Edu Runtime state model.
- Education components such as `function-transform`.
- Published lesson artifact model: immutable `manifest.json`, `concept.json`, assets, snapshots.
- AI orchestration contract: AI outputs structured teaching specs, not arbitrary production code.

## Recommended architecture

```text
apps/web/                  # forked/adapted from Open Design apps/web
apps/daemon/               # forked/adapted from Open Design apps/daemon
packages/od-contracts/     # copied or namespaced from Open Design contracts
packages/contracts/        # SuperTeacher ConceptSpec and API contracts
packages/edu-runtime/      # official renderer runtime
packages/edu-components/   # classroom interaction components
packages/edu-validation/   # schema + domain validation
packages/prompts/          # education prompt contracts
skills/edu-concept-card/   # OD skill that emits concept.json + runtime preview shell
reference/open-design/     # pinned upstream source, read-only reference
```

## Migration plan

### Phase 1: stop building on the temporary Vite shell

- Keep the current `frontend/` only as a disposable prototype.
- Do not add new product workflows to it.
- Create `skills/edu-concept-card` using OD skill front matter.
- Add a SuperTeacher `DESIGN.md` so OD generation has a classroom-specific visual guide.

### Phase 2: copy the OD workbench into first-class app folders

- Copy `reference/open-design/apps/web` to `apps/web`.
- Copy `reference/open-design/apps/daemon` to `apps/daemon`.
- Copy required `packages/contracts`, `platform`, `sidecar`, `sidecar-proto` under a namespaced package plan.
- Keep upstream imports initially; rename package scopes only after the copied app runs.

Reason: direct copying preserves working behavior. Renaming everything up front creates avoidable risk.

### Phase 3: add education artifact support

- Add a `concept.json` file kind and renderer.
- Add a `ConceptSpecViewer` that renders through `@superteacher/edu-runtime`.
- Add daemon route `POST /api/edu/spec/validate`.
- Add artifact manifest kind `edu-concept-card`.
- Teach project creation to default to `edu-concept-card` skill.

### Phase 4: constrain AI generation

- Modify the active education skill and system prompt so agent output must include:
  - `concept.json`
  - optional `index.html` shell for preview
  - no arbitrary classroom-facing logic outside the official runtime path
- Add validation before a generated spec can become publishable.

### Phase 5: immutable publish path

- Add `storage/published/{slug}/manifest.json`.
- Copy `concept.json` and runtime version into the published artifact.
- Serve published lessons read-only.
- Keep OD project workspace editable, but published artifacts immutable.

## Engineering guardrails

- Do not rewrite OD subsystems before the copied baseline runs.
- Do not keep two product shells long term.
- Treat Open Design as upstream: local changes should be isolated, documented, and easy to rebase conceptually.
- Prefer adding education-specific extension points over broad rewrites.
- Every new education path must pass schema validation before rendering or publishing.

