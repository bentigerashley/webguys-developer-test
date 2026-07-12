---
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-brainstorm
execution: code
created_at: 2026-07-12
topic: headless-wordpress-homepage
---

# Headless WordPress Homepage - Plan

## Goal Capsule

- **Objective:** Deliver a Figma-faithful, animated homepage powered by WordPress/ACF and rendered by a Next.js Pages Router frontend.
- **Product authority:** The supplied Figma file and Part 2 brief define visual and functional intent; Part 1 defines the news source.
- **Open blockers:** None. A live WordPress instance is optional for local frontend verification because deterministic fallback content is required.

---

## Product Contract

### Summary

Build the supplied corporate workplace-design homepage as a responsive headless experience. WordPress editors can assemble and reorder the major page sections with ACF flexible content, while Next.js queries the page and cached spaceflight news through GraphQL.

### Requirements

**Visual experience**

- R1. The desktop homepage follows the Figma composition, typography, monochrome palette, red-orange accents, spacing rhythm, and alternating light/dark sections.
- R2. The mobile experience preserves the same hierarchy with touch-friendly navigation, stacked content, readable type, and intentional image crops.
- R3. The page includes navigation, hero, About, services, featured cases, partners, awards/accreditations, Latest News, contact call-to-action, and footer regions.
- R4. KH Teka is served locally from the supplied font files and used consistently with appropriate fallbacks.
- R5. Imagery maintains the architectural/workplace tone of the design and includes meaningful alternative text.

**Content management and data**

- R6. WordPress defines homepage content with ACF Pro flexible-content layouts that editors can add, remove, and reorder.
- R7. Each flexible layout exposes the content needed by its frontend section without requiring code edits for ordinary copy, links, images, cases, services, partners, or awards.
- R8. WPGraphQL and WPGraphQL for ACF expose the homepage field group to the frontend.
- R9. The Part 1 plugin exposes cached articles as a typed custom WPGraphQL field, newest-first, without a live Spaceflight News API request.
- R10. Next.js fetches homepage and news data through GraphQL and can render a complete representative page when the configured WordPress endpoint is absent or unavailable.
- R11. Static regeneration keeps production pages fast while allowing WordPress edits and cached news changes to appear without a full redeploy.

**Interaction and quality**

- R12. The header supports desktop navigation and an accessible mobile menu.
- R13. Scroll and hover animation bring the page to life through restrained reveals, moving rules, image scale, counters, and staggered cards.
- R14. All non-essential animation is disabled or reduced when the visitor requests reduced motion.
- R15. Semantic landmarks, keyboard access, visible focus, contrast, heading order, and descriptive controls meet a strong accessibility baseline.
- R16. The page avoids layout shift, handles missing CMS fields safely, and remains usable when remote images or GraphQL fail.

### Key Decisions

- **Flexible sections, fixed design language:** Editors control section order and content, while frontend section components preserve Figma-level visual consistency.
- **GraphQL-first with local fallback:** WordPress is the production source of truth; fallback content makes evaluation and frontend development reliable in this standalone repository.
- **Native motion:** Use CSS and Intersection Observer rather than a heavy animation library, reducing bundle weight while supporting the required motion language.
- **News remains API-authoritative:** The GraphQL field reads Part 1’s validated local cache and does not turn articles into editable posts.

### Scope Boundaries

**In scope**

- ACF field registration, WPGraphQL integration, cached-news GraphQL schema, Next.js Pages Router application, responsive styling, motion, accessibility, tests, and local run documentation.

**Outside this phase**

- Provisioning or licensing WordPress, ACF Pro, WPGraphQL, hosting, production secrets, a full CMS database export, case-study detail pages, and an editorial preview/authentication workflow.

### Acceptance Examples

- AE1. Given no WordPress URL, when the Next.js app builds, then the full representative homepage renders from local fallback content.
- AE2. Given a configured GraphQL endpoint with flexible blocks, when the homepage regenerates, then supported blocks render in the order returned by WordPress.
- AE3. Given cached Part 1 articles, when `spaceflightNews` is queried, then typed newest-first fields are returned without calling the upstream API.
- AE4. Given a narrow viewport, when the menu opens, then focusable navigation is available without obscuring or horizontally overflowing the page.
- AE5. Given reduced-motion preference, when the page loads and scrolls, then content remains visible without transform-driven reveals or animated counters.

### Success Criteria

- The implementation is recognizably faithful to the supplied desktop and mobile Figma artboards.
- Editors can reorder the homepage’s major content sections through ACF flexible content.
- Latest News is sourced through the Part 1 plugin’s custom GraphQL schema field.
- The app builds, tests, and serves locally without requiring WordPress.
- Core homepage flows pass automated browser checks at desktop and mobile widths.

---

## Planning Contract

### Technical Direction

Create a TypeScript Next.js application in `frontend/` using Node 24 (minimum supported runtime recorded as Node 20.9), exact locked releases Next.js 16.2.10 and React 19.2.7, the Pages Router, `getStaticProps`, and incremental static regeneration. Keep GraphQL fetching and response normalization in a server-only data module. The page renderer receives a discriminated array of homepage blocks and maps each supported layout to a dedicated semantic section component; unknown layouts are ignored safely.

Add a companion WordPress plugin in `fdi-headless-cms/` that registers the ACF Pro flexible field group in PHP so configuration is portable and versioned. The field group is shown in WPGraphQL for ACF. Extend the Part 1 plugin with a typed `spaceflightNews` root field registered only when WPGraphQL is active.

Use local WOFF2 KH Teka assets copied from `KH-Teka-Trial/` into the frontend. Architectural images use stable HTTPS image URLs in fallback data and CMS image URLs in production. CSS modules/global CSS and a small Intersection Observer hook provide motion without adding an animation runtime.

### CMS and GraphQL Schema Contract

The ACF group uses GraphQL field name `homepageContent`; its flexible field is `sections`. Generated flexible-layout fragment names follow WPGraphQL for ACF’s group/field/layout convention.

| Layout | GraphQL member | Fields |
|---|---|---|
| `hero` | `HomepageContentSectionsHeroLayout` | `eyebrow` text, `heading` text, `cta` link, `marqueeText` text, `image` image |
| `about` | `HomepageContentSectionsAboutLayout` | `heading` text, `body` textarea, `cta` link, `image` image |
| `services` | `HomepageContentSectionsServicesLayout` | `heading` text, `intro` textarea, `items` repeater of title/body/image |
| `featured_cases` | `HomepageContentSectionsFeaturedCasesLayout` | `heading` text, `cases` repeater of client/title/meta/image/link |
| `partners` | `HomepageContentSectionsPartnersLayout` | `heading` text, `intro` textarea, `partners` repeater of name/logo/url |
| `awards` | `HomepageContentSectionsAwardsLayout` | `heading` text, `stats` repeater of value/label, `awards` repeater of title/issuer/year |
| `latest_news` | `HomepageContentSectionsLatestNewsLayout` | `heading` text, `articleCount` number |
| `contact` | `HomepageContentSectionsContactLayout` | `eyebrow` text, `heading` text, `email` email, `ctaLabel` text |

The page query targets the front page by URI and requests `page { homepageContent { sections { __typename ...layout fragments } } }` plus root `spaceflightNews(limit: 6)`. Required discriminators are layout typename and section heading; ordinary copy, links, media, repeaters, and images are optional and normalize to safe defaults.

Partial-data policy is slice-specific: network/non-OK/invalid JSON uses the complete local fallback; a missing page or empty sections uses fallback sections; valid page blocks with empty news preserve the intentional empty news set; GraphQL `data` plus `errors` keeps each valid slice and falls back only for a missing/malformed slice; malformed individual blocks are skipped without changing the order of valid siblings.

### Design Reference Contract

- **Reference artboards:** desktop composition at approximately 1440px, narrow/mobile composition at approximately 390px; verify at 1440, 1024, 768, and 390 CSS pixels.
- **Section order:** navigation → typographic hero → architectural media → About → dark Services → Featured Cases → Partners → dark Awards → Latest News → contact/footer.
- **Visual tokens:** warm white `#f3f2ef`, ink `#111111`, accent red-orange `#ff3b24`, hairline black/white borders, KH Teka display/body typography, oversized fluid headings, square/landscape architectural crops.
- **Fidelity evidence:** browser screenshots at 1440px and 390px are compared side-by-side with the Figma artboards for section order, dominant geometry, type scale, palette, spacing rhythm, and crop intent; exact source imagery is not required where Figma assets cannot be exported.

### Responsive Contract

| Region | Desktop ≥1024 | Tablet 768-1023 | Mobile <768 |
|---|---|---|---|
| Header | Inline navigation and CTA | Condensed gaps | Menu button with full-width overlay |
| Hero | Two-column intro, oversized marquee, wide image | Reduced type and balanced columns | Stacked copy, fluid marquee clipped intentionally, 4:5 image crop |
| About | Copy beside wide media | 40/60 split | Copy then media, 4:3 crop |
| Services | Intro, vertical tab list, active media/detail | Narrower three-column grid | Accessible accordion-like stacked tabs with active panel below |
| Cases/news | Three-card row | Two columns | Horizontal snap cards with partial next-card cue |
| Partners | Intro plus four-column logo grid | Three columns | Two columns, no horizontal overflow |
| Awards | Large stats plus ruled list | Two-column stats | Stacked stats and full-width rows |
| Contact/footer | Split CTA and sitemap columns | Reduced columns | Single column, touch targets ≥44px |

### Motion Contract

| Effect | Trigger and timing | Replay/final state | Reduced motion |
|---|---|---|---|
| Section reveal | First 15% intersection; 600ms cubic-bezier easing | Once; fully visible | Visible immediately |
| Rule expansion | Parent reveal; 700ms | Once; full width | Full width immediately |
| Card stagger | Parent reveal; 70ms index delay | Once; no delayed interactivity | No delay |
| Image scale | Reveal from 1.04 to 1 over 900ms | Once; scale 1 | Scale 1 |
| Stats | First intersection; count to CMS value over 900ms | Once; final formatted value | Final value immediately |
| Hover | Pointer card/image shift ≤6px | Returns on leave; focus uses equivalent outline/contrast | No transform |

Services use ARIA tabs on desktop/tablet with the first item selected, arrow-key navigation, linked tab/panel IDs, and persistent content. On mobile the same buttons behave as a single-open accordion, keeping the first item open. The mobile menu moves focus to its first link, makes background content inert while open, locks scroll, closes on navigation/Escape, and restores focus to the trigger.

### Key Technical Decisions

- KTD1. Use Pages Router static generation with a 60-second revalidation window so CMS/news changes appear promptly without request-time WordPress dependency.
- KTD2. Keep the CMS contract discriminated by `fieldGroupName`/layout typename, allowing block order to change while keeping each visual module strongly typed.
- KTD3. Register ACF layouts in code rather than committing database-only configuration, ensuring the assignment is reproducible.
- KTD4. Expose `spaceflightNews(limit: Int = 6)` as a typed WPGraphQL list sourced only from `SFN_Cache_Store`.
- KTD5. Treat GraphQL and image data as untrusted: normalize optional fields, allow safe links, and render plain React text/URL attributes without raw HTML.
- KTD6. Use a no-JavaScript-visible baseline: reveal animation enhances already readable content and never controls semantic availability.

### Implementation Units

### U1. WordPress ACF and GraphQL content contract

- **Goal:** Register reorderable homepage layouts and a typed cached-news GraphQL resolver.
- **Files:** `fdi-headless-cms/fdi-headless-cms.php`, `fdi-headless-cms/includes/class-fdi-home-fields.php`, `spaceflight-news-cache/includes/class-sfn-cache-graphql.php`, `spaceflight-news-cache/includes/class-sfn-cache-plugin.php`, `spaceflight-news-cache/spaceflight-news-cache.php`, `spaceflight-news-cache/tests/test-graphql.php`, `spaceflight-news-cache/tests/run.php`
- **Requirements:** R6-R9
- **Test scenarios:** field registration is guarded when ACF is absent; the field group targets the front page and exposes flexible layouts to GraphQL; GraphQL registration is guarded when WPGraphQL is absent; resolver clamps limits and returns newest cached fields without remote requests.
- **Depends on:** None.

### U2. Next.js foundation and resilient GraphQL data layer

- **Goal:** Establish the Pages Router app, types, query, response normalization, fallback content, fonts, and static regeneration.
- **Files:** `frontend/package.json`, `frontend/package-lock.json`, `frontend/.nvmrc`, `frontend/tsconfig.json`, `frontend/next.config.ts`, `frontend/pages/_app.tsx`, `frontend/pages/_document.tsx`, `frontend/pages/index.tsx`, `frontend/lib/types.ts`, `frontend/lib/cms.ts`, `frontend/data/fallback.ts`, `frontend/public/fonts/*`, `frontend/tests/cms.test.ts`
- **Requirements:** R4, R8-R11, R16
- **Test scenarios:** missing endpoint, failed/non-OK response, or invalid JSON returns complete fallback; missing page/empty sections falls back only sections; valid empty news remains empty; partial `data + errors` preserves valid slices; malformed blocks are skipped while valid block order remains stable; ISR remains 60 seconds; no private endpoint value enters client props beyond public content.
- **Depends on:** U1 for the production contract, but can be built against the documented schema.

### U3. Figma-faithful responsive section system

- **Goal:** Build navigation, hero, modular content sections, news cards, contact/footer, and responsive visual styling matching the design.
- **Files:** `frontend/components/SiteHeader.tsx`, `frontend/components/BlockRenderer.tsx`, `frontend/components/SafeImage.tsx`, `frontend/components/sections/*.tsx`, `frontend/components/SiteFooter.tsx`, `frontend/styles/globals.css`, `frontend/styles/Home.module.css`
- **Requirements:** R1-R5, R12, R15-R16
- **Test scenarios:** every supported fallback block renders; heading order and landmark structure are valid; images reserve aspect ratio/object position and replace missing/failed sources with a layout-preserving fallback; mobile menu exposes an accurate expanded state; no block requires dangerous HTML.
- **Depends on:** U2.

### U4. Motion and interaction layer

- **Goal:** Add progressive section reveals, line/image/card motion, interactive service selection, mobile menu behavior, and reduced-motion support.
- **Files:** `frontend/hooks/useReveal.ts`, `frontend/components/Reveal.tsx`, `frontend/components/AnimatedStat.tsx`, `frontend/components/SiteHeader.tsx`, `frontend/components/sections/ServicesSection.tsx`, `frontend/styles/globals.css`, `frontend/styles/Home.module.css`
- **Requirements:** R12-R15
- **Test scenarios:** revealed content is visible without Intersection Observer; observer adds enhancement classes; services implement the documented tab/accordion semantics; counters settle on final CMS values and skip animation under reduced motion; reduced-motion removes transitions/transforms; mobile menu focuses inward, contains traversal via inert background, closes after navigation/Escape, restores trigger focus, locks scroll, and keeps 44px targets.
- **Depends on:** U3.

### U5. Verification and evaluator documentation

- **Goal:** Make installation, CMS dependencies, GraphQL schema, local fallback, and verification commands clear and executable.
- **Files:** `README.md`, `frontend/README.md`, `frontend/tests/render.test.tsx`
- **Requirements:** Verifies R1-R16.
- **Test scenarios:** production build succeeds; TypeScript checks pass; unit/component tests pass; browser checks cover desktop and mobile navigation, key sections, console errors, overflow, and reduced-motion behavior.
- **Depends on:** U1-U4.

### Risks and Mitigations

- ACF Pro and WPGraphQL for ACF are external licensed/runtime dependencies; register fields defensively and document required plugins.
- WPGraphQL for ACF flexible-content type names depend on field-group naming; keep the query and PHP GraphQL names together in the plan and fallback on schema mismatch.
- Figma canvas assets are not directly exportable in this workspace; preserve the layout, typography, color, crops, and architectural subject matter with stable representative imagery.
- Remote WordPress may be offline during build; fallback content prevents build failure and makes that degraded state explicit in development.
- Large type and horizontal compositions can overflow narrow devices; verify multiple widths and use fluid clamps, grid minmax, and overflow checks.

### Verification Contract

| Gate | Applies to | Command | Done signal |
|---|---|---|---|
| PHP syntax | U1 | `docker run --rm -v ${PWD}:/app -w /app php:8.2-cli sh -c "find fdi-headless-cms spaceflight-news-cache -name '*.php' -print0 | xargs -0 -n1 php -l"` | Every PHP file reports no syntax errors. |
| WordPress unit seams | U1 | `docker run --rm -v ${PWD}:/app -w /app php:8.2-cli php spaceflight-news-cache/tests/run.php` | Existing and GraphQL test groups pass. |
| WPGraphQL smoke | U1 | Introspect a disposable/configured WordPress GraphQL endpoint. | Schema contains `spaceflightNews(limit:)`, article fields, `homepageContent`, and flexible section members; report unavailable runtime separately from seam-test results. |
| Frontend typecheck | U2-U5 | `npm run typecheck --prefix frontend` | TypeScript exits zero. |
| Frontend tests | U2-U5 | `npm test --prefix frontend` | All data/component tests pass. |
| Production build | U2-U5 | `npm run build --prefix frontend` | Next.js production build succeeds and `/` is statically generated. |
| Browser QA | U3-U5 | Run `ce-test-browser mode:pipeline` against the frontend dev server. | Desktop/mobile page, menu, sections, console, and overflow checks pass. |
| Source hygiene | All | `git diff --check` | No whitespace errors. |

### Definition of Done

- D1. R1-R16 are implemented through U1-U5 with no unresolved product decisions.
- D2. The homepage is visually faithful at desktop and mobile sizes and uses the supplied KH Teka font locally.
- D3. ACF flexible layouts can be reordered and queried through WPGraphQL for ACF.
- D4. Cached Part 1 news is queryable through a typed custom GraphQL field without upstream calls.
- D5. The Next.js app builds and renders the complete fallback homepage without WordPress.
- D6. GraphQL failure does not break the build or leave sections empty without intention.
- D7. Motion enhances the page while keyboard, focus, semantics, contrast, and reduced-motion behavior remain sound.
- D8. Automated syntax, unit, type, build, and browser verification passes.
