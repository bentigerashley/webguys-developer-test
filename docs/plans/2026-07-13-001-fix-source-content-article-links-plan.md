---
title: "fix: Restore source content and article destinations"
date: 2026-07-13
type: fix
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# Restore Source Content and Article Destinations - Plan

## Goal Capsule

- **Objective:** Remove invented homepage copy and metadata, restore the source design's ADH Build information, and ensure every news card opens its own article URL.
- **Product authority:** The supplied Figma remains the visual authority but is unavailable in this run. For information corrections only, the indexed ADH Build homepage at `https://adhbuild.com/`, retrieved 2026-07-13, is the reproducible source authority.
- **Execution profile:** Correct data at its source, preserve the existing composition and responsive behavior, and protect the corrections with focused frontend and cache tests.
- **Open blocker:** None for the bounded information/link correction. A renewed pixel/content comparison against Figma is explicitly not claimed until the artifact is supplied again; unverified wording will be omitted rather than guessed.
- **Tail ownership:** LFG owns implementation, review, browser verification, commit, and shipping.

---

## Product Contract

### Summary

The current homepage visually follows the supplied concept but changes source facts and copy into an invented FDI/New Zealand identity. The fallback news cards also all link to the Spaceflight News API homepage instead of their represented articles. The corrected page must preserve the existing layout while presenting source-faithful ADH Build information and true article destinations.

### Problem Frame

The rendered homepage is reviewable without WordPress, which makes `frontend/data/fallback.ts` part of the user-facing product rather than disposable fixture data. Rewritten brand facts, project names, services, and statistics therefore create visible misinformation. Generic API links also violate the expected behavior of a “Read story” action even though live cached GraphQL records already carry a per-article `url` field.

### Requirements

- R1. User-visible fallback content uses identity and wording supported by the indexed ADH Build source, including ADH branding, MENA geography, and the 1986 founding year.
- R2. Project and service labels use source-supported names rather than invented New Zealand cases or services.
- R3. Page metadata, header, image fallback, footer, and fallback contact details do not retain the invented FDI identity.
- R4. Each news card destination is the represented story's validated HTTP(S) article URL, never the Spaceflight News API collection or homepage URL.
- R5. Live WordPress/GraphQL article URLs continue to pass through the existing URL-safety boundary without being replaced by a generic destination.
- R6. Invalid or missing article URLs produce a non-navigating card state rather than routing users to an unrelated API page.
- R7. Existing responsive layout, animation, keyboard navigation, and section ordering remain unchanged.

### Key Flows

- F1. A reviewer opens the site without WordPress and sees source-faithful ADH Build content throughout the page.
- F2. A reviewer activates a fallback news card and reaches that card's specific external article.
- F3. A live cached article flows from the Spaceflight News API through WordPress and GraphQL to the card without losing or substituting its original article URL.

### Acceptance Examples

- AE1. Given fallback mode, when the homepage renders, then the brand and factual strings identify ADH Build, MENA, and 1986 and do not show FDI, Aotearoa, Auckland, Wellington, 1987, or unsupported awards/projects.
- AE2. Given three fallback stories, when their links are inspected, then all three are valid article-detail URLs and none equals `https://spaceflightnewsapi.net` or the v4 API collection endpoint.
- AE3. Given a GraphQL story with a valid HTTPS URL, when it is normalized and rendered, then the anchor uses that exact safe destination.
- AE4. Given a story with an unsafe or absent URL, when it is rendered, then the UI does not expose a misleading outbound “Read story” link.

### Scope Boundaries

In scope: homepage content/branding corrections, page metadata, fallback article data, article-link rendering behavior, cache URL preservation tests, and browser fidelity checks at desktop and mobile widths.

Out of scope: layout redesign, new sections, replacement of representative imagery, WordPress schema changes, article detail pages hosted by this application, and unrelated Part 3 work.

### Source Notes

- `https://adhbuild.com/` (indexed homepage result retrieved 2026-07-13) confirms: “Your Workplace, Reimagined,” ADH as a MENA workplace fit-out contractor since 1986, the portfolio names Deloitte Amman Offices, Bayer Cairo, World Bank, Talabat, and Confidential Client, and the services Design, Interior Fit Out, Design & Build, Furniture Supply, and IT/AV/SEC Solutions. Implementation must capture the adopted excerpt in a repository fixture/source note so the correction remains reviewable if the indexed page changes.
- The Figma file/frame is unavailable in the repository and browser session. This plan does not claim renewed Figma fidelity; it corrects information with reproducible ADH/API sources while preserving the already-implemented visual composition.
- Product Contract preservation: direct bootstrap plan; no upstream Product Contract was modified.

---

## Planning Contract

### Key Technical Decisions

- KTD1. Treat fallback content as production-facing content because it is the intended no-WordPress review path.
- KTD2. Correct strings in the centralized fallback model and shared chrome components instead of adding presentation-layer replacements.
- KTD3. Preserve the upstream article-detail URL end to end. The API endpoint is a fetch transport only and must never become a card destination.
- KTD4. Represent an invalid destination as unavailable/non-clickable at render time. A `#` or generic homepage fallback would misstate that a story destination exists.
- KTD5. Keep unavailable cards visually readable but remove link-only cursor, hover, focus, and action affordances; do not add replacement status copy that is absent from the source design.
- KTD6. Add explicit regression assertions for source facts and link destinations; visual inspection alone is insufficient to prevent copy drift.

### Assumptions

- The current page's distinctive structure and wording correspond to the indexed ADH Build source, but equivalence with the unavailable Figma is not asserted.
- Fallback stories use complete, captured Spaceflight News API records rather than mixing invented copy with unrelated URLs; live content remains API-authoritative.
- Source-supported contact/location content is preferred; where a precise contact value cannot be verified, omit it rather than invent it.

### Sequencing

Correct and test the data contracts first, then update shared chrome/rendering, then run browser comparison and remove any residual invented strings.

---

## Implementation Units

### U1. Restore authoritative fallback content

- **Goal:** Replace invented brand facts, cases, services, statistics, contact copy, and generic news destinations with source-supported values.
- **Files:** `frontend/data/fallback.ts`, `frontend/data/source-provenance.md`, `frontend/tests/cms.test.ts`
- **Requirements:** R1, R2, R4, R5
- **Patterns:** Keep content in the existing typed `HomeData` structure and retain `safeHref` normalization for GraphQL data.
- **Test scenarios:** fallback data contains ADH/MENA/1986 source facts traced to the dated source note; prohibited invented identity strings are absent; each fallback story is a captured upstream tuple whose ID, title, summary, site, publication time, and article URL remain associated; every URL is HTTP(S), belongs to that record, and is neither the API homepage nor collection endpoint.

### U2. Align shared chrome and link behavior

- **Goal:** Remove residual FDI/New Zealand identity from metadata, header, footer, and image fallback, and render story actions only for valid destinations.
- **Files:** `frontend/pages/index.tsx`, `frontend/components/SiteHeader.tsx`, `frontend/components/SiteFooter.tsx`, `frontend/components/SafeImage.tsx`, `frontend/components/sections/NewsSection.tsx`, `frontend/tests/render.test.tsx`
- **Requirements:** R3, R4, R6, R7
- **Patterns:** Preserve current component boundaries, accessible names, focus behavior, external-link security attributes, and visual class names.
- **Test scenarios:** shared chrome identifies ADH; metadata uses source-faithful language; valid cards expose one story-specific accessible link in logical tab order with visible focus and safe external-link attributes; invalid cards expose no link role, tab stop, pointer/hover/focus treatment, or “Read story” action; the mobile menu tests remain green.

### U3. Protect the article URL across the cache boundary

- **Goal:** Confirm the cache normalization and GraphQL layers preserve each upstream `url` as the article-detail destination.
- **Files:** `spaceflight-news-cache/tests/test-fetcher.php`, `spaceflight-news-cache/tests/test-graphql.php`
- **Requirements:** R4, R5
- **Patterns:** Extend the existing PHP seam tests without changing the established cache schema or fetch endpoint.
- **Test scenarios:** normalization preserves a valid article-detail URL; duplicate updates retain the winning record's URL; GraphQL returns that same URL; reads make no upstream HTTP call.

---

## Verification Contract

| Gate | Units | Command or evidence | Done signal |
|---|---|---|---|
| Frontend unit tests | U1, U2 | `cd frontend && npm test -- --run` | Vitest passes with source-content and article-link assertions. |
| Frontend quality | U1, U2 | `cd frontend && npm run typecheck && npm run build` | Type checking and production build complete successfully. |
| WordPress seam tests | U3 | `php spaceflight-news-cache/tests/run.php` | All cache, fetcher, API, and GraphQL tests pass. |
| Residual copy audit | U1, U2 | Search runtime frontend sources (`data/`, `pages/`, and `components/`) and rendered DOM for `FDI`, `Aotearoa`, `Auckland`, `Wellington`, `1987`, and generic Spaceflight News homepage destinations. | No prohibited invented user-facing values remain; historical repository documentation is outside this runtime-content correction. |
| Browser fidelity | U1, U2 | Inspect `http://localhost:3000/` at 1440px and 375px widths with long story content; keyboard through representative valid/invalid cards and activate a valid card. | Source content is legible without overflow, layout and focus indicators remain intact, valid cards have story-specific accessible names and resolve to article-detail URLs in a new tab, and invalid cards have no link role or tab stop. |

---

## Definition of Done

- D1. Source-faithful ADH Build identity and facts replace invented FDI/New Zealand content throughout the no-WordPress experience.
- D2. Projects, services, and statistics no longer contain fabricated substitutions.
- D3. Every available news action points to its own validated article-detail URL.
- D4. Missing or unsafe story destinations do not create misleading navigation.
- D5. Frontend tests, type checking, build, PHP tests, residual string audit, and desktop/mobile browser checks pass.
- D6. No unrelated layout or Part 3 work is included.
