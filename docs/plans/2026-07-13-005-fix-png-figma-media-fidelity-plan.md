---
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
product_contract_source: ce-plan-bootstrap
title: PNG Figma Media Fidelity - Plan
date: 2026-07-13
---

# PNG Figma Media Fidelity - Plan

## Goal Capsule

Objective: bring the homepage closer to the supplied full-page Figma PNG by correcting the most visible media mismatches: exact image content, crop proportions, section spacing around media, and interactive panels that reveal image/content incorrectly.

Product authority: the attached PNG `codex-clipboard-bb7dadb7-0f33-4c99-afc3-44ecfe234de2.png` is the visual source of truth for this pass. Existing code remains the source of truth for content ordering, accessibility, and data fallback behavior.

Open blockers: no blocker. The Figma MCP rate limit prevents fresh design calls, but the PNG contains enough visual information to crop the visible media panels.

## Product Contract

### Requirements

- R1: The hero, About, Expertise, LinkedIn collage, Featured Cases, Statistics, Latest News, and Footer newsletter imagery should use locally-cropped visual assets from the supplied PNG wherever the current site uses visibly wrong stock images.
- R2: The major desktop image frames should match the PNG proportions closely enough that the page reads like the screenshot at 1440px wide.
- R3: The Clients accordion must continue to show only the active testimonial body after the media pass.
- R4: Existing navigation, content order, responsive behavior, and accessibility semantics should remain intact.

### Scope Boundaries

- In scope: local image asset extraction, fallback image URL updates, CSS crop/proportion tuning, and tests for changed fallback contracts or client panel behavior.
- Out of scope: new CMS fields, Figma MCP calls, pixel-perfect mobile redesign, PR creation if no git remote exists, or changing section copy beyond labels already represented in code.

## Planning Contract

Key decision: use the supplied PNG as an asset sheet for this pass. This avoids approximate Unsplash substitutions and makes the most obvious remaining discrepancy, wrong imagery, directly actionable without more Figma API calls.

Risk: cropped screenshot assets are lower-fidelity than original Figma exports. Mitigation: crop at native 1440px screenshot resolution, use them only for the visible panels represented in the PNG, and preserve object-fit behavior so responsive layouts still hold.

## Implementation Units

### U1. Extract Figma PNG media crops

Goal: create local assets under `frontend/public/images/figma/` from the supplied PNG for the visible homepage media panels.

Files:
- Create: `frontend/public/images/figma/*.jpg`
- Modify: `frontend/data/fallback.ts`
- Modify: `frontend/data/design-media.ts`

Approach:
- Crop the screenshot's visible media regions: hero building atrium, About architecture, Expertise render, LinkedIn collage tiles, Featured Cases cards, Statistics red overlay, Latest News cards, and Footer collage tiles.
- Store compressed local JPG assets with stable descriptive names.
- Replace fallback/design media URLs with `/images/figma/...` paths while preserving alt text and object-position hints.

Patterns to follow:
- `frontend/data/fallback.ts` existing `img()` helper and block ordering.
- `frontend/data/design-media.ts` existing `ImageValue[]` exports.

Test scenarios:
- CMS fallback tests still confirm canonical FDI content and block order.
- Render tests still load all sections without relying on remote image URLs.

Verification:
- `npm test`
- `npm run typecheck`

### U2. Tune image frame sizing and interaction fidelity

Goal: align the desktop section proportions and visible image crops with the supplied PNG while preserving responsive layouts.

Files:
- Modify: `frontend/styles/globals.css`
- Modify as needed: `frontend/components/sections/*.tsx`
- Modify as needed: `frontend/tests/render.test.tsx`

Approach:
- Adjust the hero media height and object placement to match the large atrium panel in the PNG.
- Tune About, Expertise, LinkedIn, Cases, News, Statistics, and Footer image dimensions so the cropped assets occupy frames similar to the PNG.
- Keep Clients accordion hidden panel CSS intact and verify exactly one active testimonial region remains visible.

Patterns to follow:
- Existing `SafeImage` object-fit behavior.
- Existing section class naming in `frontend/styles/globals.css`.

Test scenarios:
- Client accordion second tab expands and leaves only one visible testimonial body.
- All homepage blocks render.
- The build accepts local image paths.

Verification:
- `npm test`
- `npm run lint`
- `npm run build`
- Browser check at desktop width against the supplied PNG, focusing on image content/crop and major section proportions.

## Verification Contract

Required commands:
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`

Manual/browser verification:
- Open the local Next page and compare the desktop flow against the supplied PNG.
- Confirm the most visible images now match the PNG source rather than generic stock imagery.
- Confirm Clients still shows one active quote panel after clicking another client.

## Definition of Done

- Local cropped assets from the supplied PNG are used by the homepage fallback/design media.
- Desktop homepage imagery and image frame proportions are visibly closer to the supplied PNG.
- Existing automated checks pass.
- No unrelated generated files or dev logs remain in the working tree.
