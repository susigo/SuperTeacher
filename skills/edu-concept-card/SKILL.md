---
name: edu-concept-card
description: |
  Generate a browser-based interactive teaching concept card for SuperTeacher.
  The primary output is a validated ConceptSpec JSON file, rendered by the official Edu Runtime.
triggers:
  - "interactive lesson"
  - "concept card"
  - "互动课件"
  - "动态课件"
  - "概念讲解"
od:
  mode: prototype
  surface: web
  scenario: education
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: true
    sections: [color, typography, layout, components, motion]
  craft:
    requires: [typography, color, anti-ai-slop, accessibility-baseline]
  inputs:
    - name: subject
      type: enum
      values: [math, physics, chemistry, biology, geography, other]
      required: true
    - name: grade
      type: string
      required: true
    - name: concept
      type: string
      required: true
  outputs:
    primary: index.html
    secondary: [concept.json]
  capabilities_required:
    - file_write
---

# SuperTeacher Edu Concept Card

You are generating an interactive teaching artifact for SuperTeacher.

The classroom-facing source of truth is `concept.json`, not arbitrary frontend code. The HTML file is only a preview shell for Open Design's artifact workspace.

## Required outputs

1. Write `concept.json`.
2. Write `index.html`.
3. `concept.json` must follow ConceptSpec v0.1 shape.
4. `index.html` must visibly explain that the artifact is rendered from ConceptSpec and should load or embed the generated JSON for preview.

## ConceptSpec requirements

Use this top-level structure:

```json
{
  "schemaVersion": "0.1.0",
  "projectType": "concept-card",
  "subject": "math",
  "grade": "middle",
  "concept": {
    "title": "",
    "summary": "",
    "learningGoals": [],
    "commonMisconceptions": []
  },
  "interaction": {
    "template": "function-transform",
    "engine": "svg",
    "formula": "y = a(x - h)^2 + k",
    "variables": []
  },
  "storyboard": [],
  "assessment": [],
  "theme": {
    "designSystem": "math-minimal",
    "motionIntensity": "medium"
  }
}
```

## First supported template

For quadratic function transformation, use:

- `interaction.template`: `function-transform`
- variables: `a`, `h`, `k`
- formula: `y = a(x - h)^2 + k`
- engine: `svg`

Each variable must include:

- `id`
- `label`
- `type`: `slider`
- `min`
- `max`
- `step`
- `default`
- `meaning`

## Rules

- Do not generate a standalone custom teaching app as the real product output.
- Do not hide core math logic inside `index.html`.
- Keep all educational intent, variables, steps, assessment, and misconceptions in `concept.json`.
- Use `index.html` only as a readable preview shell in the Open Design workspace.
- Prefer a small, correct, inspectable spec over a visually ambitious but unvalidated artifact.

