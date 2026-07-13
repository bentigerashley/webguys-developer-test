---
title: "Figma Content Fidelity - Plan"
date: 2026-07-13
type: fix
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-brainstorm
execution: code
---

# Figma Content Fidelity - Plan

## Goal Capsule

- **Objective:** Make the implemented homepage reproduce the supplied Figma’s content, branding, section order, and responsive presentation without invented substitutions.
- **Product authority:** Figma file `EFx0NBu50PIC74FmHCYGDN`, canonical `Homepage Full Design` frame (1440 × 13006), its component section, and its corresponding responsive frame.
- **Open blockers:** None. When CMS or fallback content conflicts with the Figma, the Figma wording and visible values win.

---

## Product Contract

### Summary

The current site incorrectly replaced the Figma’s FDI identity with ADH content and previously paraphrased other visible information. The correction must audit the complete Figma composition and reproduce its text verbatim, including content that the implementation omitted.

### Requirements

- R1. The landing’s dominant typographic mark reads `FDI® RI` exactly as designed; it is not replaced by `ADH.BUILD`, “Your Workplace, Reimagined,” or another interpretation.
- R2. Shared branding, metadata, navigation, fallback states, and footer identify FDI exactly as shown in Figma; no ADH identity remains in rendered runtime content.
- R3. The desktop and responsive implementations follow the Figma’s authoritative section order: navigation, landing/hero, About Us, What Do We Do, LinkedIn, Featured Cases, Our Partners, Clients, Awards/Accreditations, Latest News, and footer/contact content.
- R4. Every Figma-authored heading, paragraph, label, CTA, client/project name, statistic, date/year, location, and footer line is transcribed without paraphrase or invented geography, awards, contact details, or service descriptions. API-driven Latest News article titles, summaries, publishers, dates, images, and destinations remain sourced from the API under R7.
- R5. The LinkedIn section is present with `Follow FDI on LinkedIn!`, `To keep up to date and be the first to know about the news`, and `Follow us on LinkedIn`.
- R6. The recognition/statistics treatment preserves the visible Figma values `40+`, `36`, and `1986` with their corresponding labels.
- R7. Latest News remains API-driven, and every card opens its represented article-detail URL rather than a Spaceflight News API endpoint or collection page.
- R8. Available Figma visual evidence governs image crops, black/light panels, red accent treatments, typography scale, spacing rhythm, and mobile stacking section by section; where source image export is unavailable, existing representative images are retained with Figma-matched crop and placement rather than presented as exact source assets.
- R9. Existing keyboard, focus, reduced-motion, safe-URL, responsive, and semantic-heading behavior remains accessible after the fidelity corrections.

### Acceptance Examples

- AE1. Given fallback mode at desktop width, the dominant landing copy is `FDI® RI`, FDI branding is consistent, and no ADH copy is rendered.
- AE2. Given the complete homepage, each Figma section appears once in the same order, including the LinkedIn and Clients sections.
- AE3. Given a side-by-side audit at 1440px and 375px, all visible text matches the corresponding Figma layers and no long copy clips or overlaps.
- AE4. Given a news card with a valid article URL, activation opens that article; invalid/non-HTTP(S) destinations expose no misleading link action.

### Scope Boundaries

In scope: all homepage runtime strings and content models, missing Figma sections, section ordering, shared chrome, relevant imagery/crops/styles, responsive states, CMS fallback parity, tests, and browser evidence.

Out of scope: Part 3 functionality, editing the Figma file, unrelated WordPress administration changes, and inventing destination pages that the design does not specify.

### Source Evidence

- Figma: `https://www.figma.com/design/EFx0NBu50PIC74FmHCYGDN/Developer-Test-%E2%80%93-Website_V1--Copy-?node-id=3-267`
- Canonical frame hierarchy inspected in authenticated Figma: `Homepage Full Design` → `Frame 61676` → Navigation, Header, About Us, Main Container, LinkedIn, Cases, Partners, Clients, Awards, `Frame 61689`, Footer.
- The Figma’s LinkedIn section was inspected at 100% and provides the exact copy recorded in R5.

---

## Planning Contract

Product Contract unchanged.

### Key Technical Decisions

- KTD1. Extend the discriminated homepage block union with dedicated LinkedIn and Clients blocks so the Figma order is explicit and testable.
- KTD2. Keep Figma-authoritative fallback copy in `frontend/data/fallback.ts`. LinkedIn and Clients are design-fixed frontend blocks in this version: normalize CMS blocks to unique types, insert LinkedIn immediately after Services and Clients immediately after Partners, preserve present CMS content, and produce the canonical order for full, partial, empty, duplicated, or malformed CMS responses.
- KTD3. Preserve external article URL normalization and captured article-detail data while correcting presentation content.
- KTD4. Reuse the responsive grid, reveal, safe-image, and reduced-motion patterns, adding only section-specific styling required by the missing Figma regions.

### Sequencing

Correct the content contract and block types, render and style missing regions, update shared chrome, then lock the result with automated and browser verification.

---

## Implementation Units

### U1. Restore the Figma content model and fallback source

- **Goal:** Make FDI and the canonical Figma section sequence the stable fallback contract.
- **Files:** `frontend/lib/types.ts`, `frontend/data/fallback.ts`, `frontend/lib/cms.ts`
- **Covers:** R1-R7, AE1-AE2, KTD1-KTD3.
- **Test scenarios:** Fallback serialization contains `FDI® RI`, the three LinkedIn strings, `40+`, `36`, and `1986`; ADH and MENA copy are absent; blocks appear in canonical order; article-detail URLs remain safe HTTP(S) destinations.

### U2. Render the missing LinkedIn and Clients regions

- **Goal:** Add accessible, responsive sections corresponding to the omitted Figma layers.
- **Files:** `frontend/components/BlockRenderer.tsx`, `frontend/components/sections/LinkedInSection.tsx`, `frontend/components/sections/ClientsSection.tsx`, `frontend/styles/globals.css`
- **Covers:** R3, R5, R8-R9, AE2-AE3, KTD1, KTD4.
- **Test scenarios:** Each section renders once in source order; the LinkedIn CTA is keyboard-operable and safely linked; client marks remain readable at desktop and mobile widths; no page overflow is introduced.

### U3. Correct shared identity and visible labels

- **Goal:** Remove the ADH substitution and restore FDI metadata, navigation, hero, fallbacks, and footer copy.
- **Files:** `frontend/components/SiteHeader.tsx`, `frontend/components/SiteFooter.tsx`, `frontend/components/SafeImage.tsx`, `frontend/components/sections/HeroSection.tsx`, `frontend/pages/index.tsx`, `frontend/data/source-provenance.md`
- **Covers:** R1-R4, R6, R8-R9, AE1, KTD2.
- **Test scenarios:** The dominant hero text reads `FDI® RI`; header/footer accessible names and metadata identify FDI; no rendered ADH string remains; image failure fallback identifies FDI.

### U4. Lock fidelity and destination behavior with regression coverage

- **Goal:** Make content and API-link regressions fail locally.
- **Files:** `frontend/tests/render.test.tsx`, `frontend/tests/cms.test.ts`, `spaceflight-news-cache/tests/run.php`
- **Covers:** R1-R9, AE1-AE4.
- **Test scenarios:** Assert exact hero and LinkedIn strings, section order, FDI chrome, statistics, no ADH identity, safe invalid URLs, real article-detail links, and graceful CMS fallback.

---

## Verification Contract

| Gate | Command or method | Done signal |
|---|---|---|
| Frontend unit tests | `cd frontend && npm test -- --run` | All Vitest suites pass |
| Type safety | `cd frontend && npm run typecheck` | TypeScript exits cleanly |
| Production build | `cd frontend && npm run build` | Next.js production build succeeds |
| PHP behavior | `docker run --rm -v "${PWD}:/app" -w /app php:8.2-cli php spaceflight-news-cache/tests/run.php` | Article URL and API tests pass |
| Desktop fidelity | Compare localhost at 1440px with Figma `Homepage Full Design` | Correct identity, copy, order, crops, and no clipping |
| Mobile fidelity | Compare localhost at 375px with responsive Figma frame | Correct stacking, readable copy, usable navigation, no overflow |
| Runtime quality | Inspect browser console and article-card destinations | No application errors; valid cards resolve to article-detail URLs |

---

## Definition of Done

- Every canonical Figma region renders once and in order.
- `FDI® RI`, the LinkedIn wording, and the recognition values match the inspected Figma evidence.
- No ADH/MENA substitution remains in runtime content or tests.
- Shared chrome, metadata, CMS fallback behavior, and failure states identify FDI.
- Latest News cards retain safe article-detail destinations and never expose Spaceflight News API endpoints as article links.
- Automated gates pass and desktop/mobile browser comparisons show no clipping, overlap, inaccessible interaction, or console errors.
