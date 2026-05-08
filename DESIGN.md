# SuperTeacher Classroom Studio

## Visual Theme & Atmosphere

Purposeful, calm, classroom-ready. The product should feel like a professional teaching control room: clear, legible, and stable enough to trust during a live class.

## Color Palette & Roles

- Canvas: `#F6F7F9`
- Surface: `#FFFFFF`
- Ink: `#17202A`
- Muted text: `#667085`
- Primary action: `#176B5B`
- Math accent: `#2563EB`
- Warning: `#B54708`
- Error: `#B42318`

Avoid visual themes dominated by purple gradients, heavy dark dashboards, or decorative illustration. Use color to clarify state and teaching focus.

## Typography Rules

Use clear Chinese and Latin text rendering. UI labels should be compact. Teaching preview text can be slightly warmer and larger, but never oversized in dense editor panels.

## Component Stylings

Panels should be functional work surfaces, not decorative cards. Prefer split panes, tabs, inspectors, file trees, preview canvases, sliders, and segmented controls.

## Layout Principles

The default workspace should support three parallel tasks:

- concept input and chat
- structured spec inspection
- live classroom preview

Keep preview prominent. Keep editing controls close to the spec they modify.

## Depth & Elevation

Use borders and subtle background changes before shadows. Reserve overlays for modals, preview fullscreen, and publish dialogs.

## Do's and Don'ts

Do make generated teaching artifacts inspectable.

Do show validation status before publishing.

Do keep classroom preview visually stable.

Do not present generated arbitrary HTML as the trusted classroom output.

Do not bury `concept.json` behind the preview.

## Responsive Behavior

Desktop is the primary authoring surface. Mobile can stack panels vertically for review, but full authoring may remain desktop-first in MVP.

## Agent Prompt Guide

Generate structured educational artifacts. Put subject matter, variables, misconceptions, steps, and assessment into `concept.json`. Use HTML only as a preview shell or exported static view of the validated runtime.

