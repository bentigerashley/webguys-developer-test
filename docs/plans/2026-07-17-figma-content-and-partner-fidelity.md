---
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
---

# Figma Content and Partner Fidelity

## Problem Frame

The homepage needs a final fidelity pass against the supplied Figma/PDF reference. The news rail must use the Part 1 WordPress GraphQL cache path in normal operation, and the About, section tags, Featured Cases, and Our Partners content/layout must match the reference rather than fallback placeholders.

## Settled Decisions

- **Keep Spaceflight News on the Part 1 GraphQL integration** `(session-settled: user-directed - chosen over a client-side Spaceflight API request: the user explicitly requires the existing API call)`.
- **Treat supplied Figma/PDF copy and layouts as canonical** `(session-settled: user-directed - chosen over invented replacement content: the user requested fidelity to those references)`.
- **Show partner names with their supplied logo assets in the carousel** `(session-settled: user-directed - chosen over text-only placeholder marks: the reference shows both)`.

## Implementation Units

### U1: Preserve and prove the server-side news data path

**Files:** `frontend/lib/cms.ts`, `spaceflight-news-cache/includes/class-sfn-cache-graphql.php`, `frontend/tests/cms.test.ts`, `spaceflight-news-cache/tests/test-graphql.php`

- Keep the page query directed at `spaceflightNews(limit: 7)` on the WordPress GraphQL endpoint.
- Ensure the CMS normalization preserves returned stories and uses the capture only when the endpoint is unavailable or invalid.
- Confirm the cache GraphQL default and resolver support seven stories.

**Tests:** verify the homepage query requests seven stories, a valid backend tuple is retained, and the GraphQL resolver yields seven entries when enough cached articles exist.

### U2: Correct reference copy, tags, and Featured Cases composition

**Files:** `frontend/data/fallback.ts`, `frontend/components/sections/AboutSection.tsx`, `frontend/components/sections/CasesSection.tsx`, `frontend/components/SiteHeader.tsx`, `frontend/styles/globals.css`, `frontend/tests/render.test.tsx`

- Replace incorrect About fallback copy with the reference wording.
- Align section labels/counts and header tab targets with their intended sections.
- Move the Featured Cases heading into its Figma grid placement and add its reference CTA without regressing rail controls or accessibility.

**Tests:** assert the canonical About copy, section labels, CTA, and case controls render with safe destinations.

### U3: Restore partner logo/name presentation

**Files:** `frontend/data/fallback.ts`, `frontend/components/sections/PartnersSection.tsx`, `frontend/styles/globals.css`, `frontend/tests/render.test.tsx`

- Populate partner records with logo assets where available while retaining their accessible names.
- Match the reference rail card sizing, label treatment, and controls on desktop/mobile.

**Tests:** assert every partner card exposes its partner name and renders the provided logo when present; retain carousel boundary behavior.

## Verification Contract

- `npm run lint`, `npm run typecheck`, and `npm test -- --run` in `frontend`.
- `scripts/verify-release.ps1` after stopping the dev server to avoid the Windows native-module lock.
- Visual inspection of About, Featured Cases, Partners, and News at 1440px and 390px with no horizontal overflow.

## Risks

- No PDF file is present in the repository; implementation will use the supplied Figma screenshots and established visual reference captures where the PDF is unavailable.
- CMS-provided partner assets may be incomplete, so the canonical fallback must retain accessible text labels.
