---
title: "Figma Visual Fidelity - Plan"
date: 2026-07-13
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-brainstorm
execution: code
---

# Figma Visual Fidelity - Plan

## Goal Capsule

- **Objective:** Rebuild the frontend presentation so every implemented homepage component matches the supplied Figma component definition and `Homepage Full Design`, with motion quality informed by ADH Build.
- **Authority:** Figma controls component composition, colors, typography, imagery placement, dimensions, spacing, responsive structure, and content hierarchy. ADH Build controls only interaction feel, reveal pacing, hover behavior, and smoothness where Figma is silent.
- **Open blockers:** None. Existing representative images may be cropped and arranged to match Figma when the original Figma raster cannot be exported, but must not be presented as exact source imagery.

---

## Product Contract

### Summary

The current page captures the brand palette and some content but substitutes generic section layouts for the authored design system. The correction must reproduce the Figma component library and full-page rhythm as one cohesive responsive experience rather than styling each section independently.

### Requirements

**Design system and page shell**

- R1. The desktop page uses the Figma's white, black, grey, and red visual system, KH Teka typography, 20px outer inset/grid alignment, square geometry, fine dividers, and large editorial type without the current beige theme or generic numbered-section styling.
- R2. Navigation matches the 1440 × 66 Figma component: compact logo area, centered normal links with assistive-technology-hidden decorative chevrons where designed, a contact action, and a black menu cell; the responsive menu remains keyboard-accessible. No unsupported dropdown content is implied.
- R3. The hero matches the Figma Header and Media composition: left metadata column, right `Re-imagined Your Workplace` headline and red CTA, followed by the oversized cropped `FDI® RI` wordmark and full-width architectural media.
- R4. The full desktop page follows the exact Figma component order and macro heights represented by `Homepage Full Design`; adjacent sections meet without arbitrary gaps or duplicated framing.

**Component fidelity**

- R5. About Us uses the Figma's white editorial layout, compact label, large headline/copy hierarchy, red action treatment, and asymmetric architectural media placement.
- R6. Expertise matches the 1440 × 1112 black component: centered `What Do We Do`, left supporting copy/action, vertical service selector, and a white service-detail card with large image and multi-column text.
- R7. Featured Cases uses the Figma's white portfolio composition, three primary landscape cards, strong image-led hierarchy, compact metadata, and horizontal browsing behavior where content exceeds the viewport.
- R8. LinkedIn matches the 1440 × 1067 white collage component: centered two-line heading and description, long red CTA, and five architectural images positioned around rather than behind the content.
- R9. Partners and Clients remain separate components: Partners is a restrained logo matrix with Figma header treatment; Clients is a dense multi-row client list/grid, not a repeated oversized four-name list.
- R10. Statistics matches the 1440 × 810 red-tinted photographic component with dominant white `40+`, `36`, and `1986` typography and the labels positioned at their corresponding values.
- R11. Awards & Accreditations matches the black list component with large title, disciplined rows/dividers, compact metadata, and red action accent.
- R12. Latest News matches the approximately 1440 × 1048 black component: centered title, left editorial introduction/action, landscape news rail, and circular previous/next controls while retaining direct article-detail links.
- R13. Footer matches the 1440 × 1663 white image-collage component: presentational newsletter field/action styling without form or button semantics until an endpoint exists, large `Let's get in touch`, navigation/contact columns, social links, and compact legal baseline. Unsupported contact details remain omitted rather than invented.

**Motion and responsive behavior**

- R14. Motion adopts ADH Build's restrained premium feel: short staggered reveal transitions, image masks/scales, underline or color hover feedback, count-up statistics, horizontal rail controls, and menu transitions without continuous decorative motion.
- R15. Motion respects `prefers-reduced-motion`; content is never hidden when scripting or observers are unavailable.
- R16. At 375px, 768px, 1024px, and 1440px, component hierarchy remains faithful while complex desktop grids collapse deliberately, touch controls remain at least 44px, text does not clip, and no page-level horizontal overflow occurs.
- R17. The preloader/menu concepts shown in Figma are represented by a brief accessible first-load brand reveal and the existing operable menu, without delaying repeat navigation or trapping assistive technology.

### Acceptance Examples

- AE1. Given side-by-side 1440px captures, each rendered section is recognizably the same composition as its corresponding Figma component and appears in the same full-page order.
- AE2. Given the Expertise, LinkedIn, Statistics, News, and Footer components, their dominant background, type scale, media geometry, and content columns match the inspected Figma dimensions rather than the prior generic layout.
- AE3. Given pointer and keyboard use, service tabs, case/news rails, CTAs, and menu expose visible focus, correct state, and smooth but restrained feedback comparable to ADH Build.
- AE4. Given reduced-motion preference, count-up and reveal effects resolve immediately without hiding content or disabling interaction.
- AE5. Given 375px and intermediate widths, all content remains readable, controls remain usable, and the document width does not exceed the viewport.
- AE6. Given a valid news item, its card still links once to the represented publisher article; unsafe URLs remain noninteractive.

### Scope Boundaries

In scope: all homepage component markup and CSS, shared navigation/footer, motion primitives, responsive layouts, imagery arrangement/crops, loading treatment, rail controls, accessibility, regression tests, and browser evidence.

Out of scope: copying ADH Build's branding/content, scraping proprietary ADH assets, changing backend schemas, inventing unavailable Figma contact data, and building separate internal pages not included in the supplied homepage design.

### Source Evidence

- Figma `Components` section: Navigation 1440 × 66; Expertise 1440 × 1112; LinkedIn 1440 × 1067; Statistics 1440 × 810; News approximately 1440 × 1048; Footer 1440 × 1663; plus About Us, Cases, Partners, Awards, Clients, Header, and Media definitions.
- Figma `Homepage Full Design`: 1440 × 13006 composition.
- ADH Build homepage: reference for staggered entrances, masked imagery, hover feedback, horizontal browsing, count-up metrics, menu motion, and overall pacing only.

---

## Planning Contract

Product Contract unchanged.

### Key Technical Decisions

- KTD1. Preserve the existing block data/CMS contract and rebuild presentation components around a shared Figma shell: component header, 20px inset grid, red square CTA, light/dark section variants, and editorial typography tokens.
- KTD2. Split the current monolithic stylesheet into ordered token/base/component/responsive regions without introducing a runtime styling dependency.
- KTD3. Add a small reusable horizontal rail hook for cases/news, using a labelled native scroll region plus section-specific named previous/next buttons, native disabled boundaries, focus preservation, and automatic rather than smooth scrolling under reduced motion; service tabs retain their accessible tab pattern.
- KTD4. Add an `aria-hidden`, non-focusable, `pointer-events:none` preloader with an 850ms maximum, no inert/focus mutation, and a sessionStorage seen flag. Reduced motion or storage failure renders the final state immediately.
- KTD5. Add a typed frontend-only `designMedia` mapping that reuses the existing safe representative image URLs for five LinkedIn positions, the statistics background, and footer collage. Components render every source through `SafeImage`; no CMS schema or external ADH asset is added.
- KTD6. Browser comparison at the integrated browser's desktop viewport plus responsive code/test assertions provide the visual evidence; document-width overflow is evaluated in the real browser because jsdom does not calculate layout.

---

## Implementation Units

### U1. Establish the Figma shell, navigation, hero, and motion primitives

- **Files:** `frontend/styles/globals.css`, `frontend/components/SiteHeader.tsx`, `frontend/components/sections/HeroSection.tsx`, `frontend/components/Reveal.tsx`, `frontend/components/Preloader.tsx`, `frontend/pages/_app.tsx`, `frontend/tests/render.test.tsx`
- **Covers:** R1-R4, R14-R17, AE1, AE3-AE5.
- **Test scenarios:** Figma navigation labels/cells render; hero contains editorial headline and oversized wordmark in distinct regions; preloader is non-blocking and reduced-motion safe; menu remains keyboard trapped/escapable; reveal content is visible without observers.

### U2. Recompose About, Expertise, Cases, and LinkedIn

- **Files:** `frontend/components/sections/AboutSection.tsx`, `frontend/components/sections/ServicesSection.tsx`, `frontend/components/sections/CasesSection.tsx`, `frontend/components/sections/LinkedInSection.tsx`, `frontend/data/design-media.ts`, `frontend/hooks/useHorizontalRail.ts`, `frontend/styles/globals.css`, `frontend/tests/render.test.tsx`
- **Covers:** R5-R8, R14-R16, AE1-AE5.
- **Test scenarios:** component headings/labels and card structures match Figma; service keyboard navigation persists; case rail controls move the native rail and expose disabled boundaries; LinkedIn retains five decorative media positions and a safe CTA fallback; no overflow at responsive breakpoints.

### U3. Recompose Partners, Clients, Statistics, Awards, News, and Footer

- **Files:** `frontend/components/sections/PartnersSection.tsx`, `frontend/components/sections/ClientsSection.tsx`, `frontend/components/sections/AwardsSection.tsx`, `frontend/components/sections/NewsSection.tsx`, `frontend/components/SiteFooter.tsx`, `frontend/data/fallback.ts`, `frontend/styles/globals.css`, `frontend/tests/render.test.tsx`
- **Covers:** R9-R16, AE1-AE6.
- **Test scenarios:** partners and clients are distinct dense structures; statistics retain exact values and red photographic treatment; awards/news use black editorial layouts; news rail retains one safe direct article link per valid card; footer omits invented details while matching the Figma composition.

### U4. Lock responsive and visual behavior

- **Files:** `frontend/tests/render.test.tsx`, `frontend/tests/cms.test.ts`, `frontend/styles/globals.css`, `.github/workflows/deploy-staging.yml`
- **Covers:** R1-R17, AE1-AE6.
- **Test scenarios:** semantic section order, component labels, rail controls, safe URLs, reduced-motion classes, and FDI identity are asserted; browser passes root content, interactions, console state, and document-width checks; production build remains green.

---

## Verification Contract

| Gate | Command or method | Done signal |
|---|---|---|
| Lint | `cd frontend && npm run lint` | Zero warnings/errors |
| Types | `cd frontend && npm run typecheck` | TypeScript clean |
| Tests | `cd frontend && npm test -- --run` | Vitest clean |
| Build | `cd frontend && npm run build` | Standalone build succeeds |
| Browser desktop | Compare localhost with Figma components/full design and ADH motion reference | Same composition/order, no console errors, direct article links |
| Browser responsive | Inspect DOM/CSS at mobile and intermediate breakpoints and run overflow assertions | No clipping or document overflow; controls remain accessible |
| CI | Add pull-request validation while retaining main-only deployment, then observe the feature PR checks | Validation green before merge |

---

## Definition of Done

- Every Figma homepage component has a corresponding faithful rendered composition and the full-page order matches `Homepage Full Design`.
- The prior beige/generic numbered-section presentation is removed from runtime.
- Navigation, hero, expertise, LinkedIn, statistics, news, and footer match their dominant Figma geometry and color treatment.
- Motion is restrained, functional, reduced-motion safe, and comparable in pacing to ADH Build without copying its assets or brand.
- Automated gates and browser checks pass; direct article destinations and accessibility behavior remain intact.
- Changes are reviewed, committed, pushed, and delivered through a green GitHub Actions run.
