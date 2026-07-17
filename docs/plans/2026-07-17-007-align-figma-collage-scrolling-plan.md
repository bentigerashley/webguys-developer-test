---
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
product_contract_source: ce-plan-bootstrap
title: Align Figma Collage Geometry and Scroll Progression
type: fix
date: 2026-07-17
---

# Align Figma Collage Geometry and Scroll Progression

## Goal Capsule

- **Objective:** eliminate the remaining LinkedIn and footer visual artifacts, restore the component-board geometry, and add the desktop sticky-scroll behavior requested from the ADH reference.
- **Product authority:** Figma component board `2001:1289`, including LinkedIn `2001:1296` and Footer `2001:1302`, plus the user-supplied component PNG. These are session-settled, user-directed visual requirements; an approximate static composition was rejected because it leaves the visible errors unresolved.
- **Motion authority:** the supplied `adhbuild.com` reference establishes desktop sticky progression for the image-led LinkedIn and newsletter scenes. It is session-settled, user-directed; the rejected alternative is a static scene that cannot deliver the requested scrolling behavior. Narrow layouts retain ordinary flow for readability and reachability.
- **Scope boundary:** preserve the existing accessible links, native newsletter forms, backend news path, and all completed components. Do not add a carousel or animation dependency.

## Requirements

- LinkedIn must render a clean two-line heading, a centered 652px desktop content column, 454px CTA, and correctly layered crop positions without text/image overlap.
- The LinkedIn image collage must use a sticky desktop stage that holds its composition while its parent section scrolls; mobile must disable sticky positioning and retain a compact, non-overlapping flow.
- The newsletter scene must match the Figma 1440px collage geometry: 1034px showcase height, 217px top image, 217px by 422px left image, 206px by 496px right image, and correctly placed lower crops.
- Newsletter copy must use the Figma caption and full-width 454px stacked email/button controls.
- The footer contact band must place navigation and socials at left, heading/form in the center, newsletter marker at the upper right, and office contact details in the lower center.
- The newsletter scene must use the same sticky desktop progression strategy and normal responsive flow on mobile.

## Implementation Units

### U1. Stage markup and visible copy

- **Files:** `frontend/components/sections/LinkedInSection.tsx`, `frontend/components/SiteFooter.tsx`.
- **Approach:** introduce semantic stage wrappers only; keep headings, forms, CTA safety, and image accessibility behavior intact. Move office details back to the lower contact-band position and use the Figma caption.
- **Verification:** component tests retain accessible heading/link/form expectations.

### U2. Figma geometry and desktop stickiness

- **Files:** `frontend/styles/globals.css`.
- **Approach:** place each collage media crop according to the Figma component coordinates, establish a bounded outer scroll region with a sticky inner stage below the persistent header, and neutralize the sticky behavior at the existing mobile breakpoint. Give the central text layer an explicit stacking context above decorative media.
- **Verification:** desktop screenshot matches component geometry at rest and maintains a fixed content scene during the section scroll; mobile has no horizontal or text overflow.

### U3. Regression verification and shipping

- **Files:** `frontend/tests/render.test.tsx`, any release artifacts only if required.
- **Approach:** assert stage structural hooks and Figma caption/text positioning contracts, then run typecheck, lint, tests, build, release verification, and desktop/mobile browser checks. Finish with inline simplification/review, commit, push, and PR creation where the environment permits.

## Definition of Done

- LinkedIn and newsletter show no stray or clipped text artifacts.
- Both scenes use a real desktop sticky progression and mobile normal flow.
- Footer geometry and contact distribution match Figma’s component board.
- Existing interactions and backend-backed Latest News behavior remain intact.
- Required automated and browser checks pass; the completed branch is committed and pushed, with a PR opened when GitHub tooling is available.
