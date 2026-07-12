---
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-brainstorm
execution: code
created_at: 2026-07-12
topic: spaceflight-news-cache
---

# Spaceflight News Cache - Plan

## Goal Capsule

- **Objective:** Provide a WordPress-managed, locally cached source of recent Spaceflight News API articles for the Part 2 news feed.
- **Product authority:** The supplied developer-test brief and the Spaceflight News API are authoritative; remote articles remain read-only.
- **Open blockers:** None.

---

## Product Contract

### Summary

Build a custom WordPress plugin that lets an administrator define which recent spaceflight articles to collect and how often to refresh them. The plugin retains a usable local cache so the later news feed does not depend on a live API request.

### Problem Frame

The public news API is rate-limited and cannot safely sit directly behind page rendering. Site administrators need a small control surface for feed criteria, while the frontend needs stable local news data that remains available between refreshes and during temporary upstream failures.

### Requirements

**Administration**

- R1. An authorized WordPress administrator can enter and save a search phrase.
- R2. An authorized WordPress administrator can enter and save a publication-date cutoff.
- R3. An authorized WordPress administrator can choose and save an update frequency from a bounded set of practical schedules.
- R4. The administration screen shows the most recent successful refresh, the next scheduled refresh, the cached item count, and the latest refresh error when one exists.
- R5. An administrator can request an immediate refresh without waiting for the next scheduled run.

**Collection and cache behavior**

- R6. A refresh requests recent articles matching the saved search phrase and excludes articles published before the saved cutoff.
- R7. Matching articles are stored locally as a read-only cache with the source fields needed by the Part 2 news cards, including stable identity, title, summary, image, publication time, source, and article URL.
- R8. Repeated refreshes update existing cached articles by stable source identity and do not create duplicates.
- R9. Articles that no longer match the current saved criteria are removed from the active cache after a successful refresh.
- R10. A failed or malformed upstream response preserves the last successful cache and records a useful administration-facing error.
- R11. Scheduled refreshes follow the saved frequency, and changing that frequency replaces the previous schedule.
- R12. Deactivating the plugin removes its scheduled refresh while preserving cached content and settings for safe reactivation.

**Consumption**

- R13. The plugin exposes the active cached articles through a stable WordPress-facing interface that Part 2 can consume without contacting the upstream API.
- R14. Cached results are returned newest-first and are safe for public display.

### Key Decisions

- **API-authoritative cache:** Imported articles are not editable WordPress posts; this avoids content drift and makes refresh behavior deterministic.
- **Last-known-good availability:** Upstream failure never empties a previously valid feed.
- **Criteria define the active set:** A successful refresh replaces the active result set for the current search phrase and cutoff rather than accumulating unrelated historical matches.
- **Operational visibility:** Manual refresh and sync status are part of the admin experience because scheduled jobs are otherwise difficult to verify.

### Scope Boundaries

**In scope**

- WordPress plugin lifecycle, settings, scheduling, API collection, local caching, administration feedback, and a stable read interface for Part 2.

**Deferred for later**

- The Figma-matched public news feed and other Part 2 presentation work.

**Outside this phase**

- Editing imported stories, promoting stories into ordinary posts, authoring original news, API credentials or paid API tiers, and analytics.

### Acceptance Examples

- A1. Given valid criteria and an available API, when an administrator refreshes, then matching recent articles become available locally newest-first.
- A2. Given an article already exists locally, when a later refresh returns the same source identity with changed content, then the cached item is updated without duplication.
- A3. Given a valid cache exists, when the API times out or returns invalid data, then the existing cache remains available and the admin screen reports the failure.
- A4. Given the refresh frequency changes, when settings are saved, then only the replacement schedule remains active.
- A5. Given the search phrase or cutoff changes, when the next refresh succeeds, then the active cache reflects the new criteria.

### Success Criteria

- Administrators can configure and verify collection without code changes.
- Public consumers never need a live Spaceflight News API request.
- Routine refreshes do not duplicate articles or destroy valid cached data on failure.
- The cached data contract contains everything needed for the Part 2 news cards.

---

## Planning Contract

### Technical Direction

Implement a self-contained plugin under `spaceflight-news-cache/` using WordPress core APIs only. Store configuration and operational metadata in options, store the normalized article collection in a non-autoloaded option, use WP-Cron for scheduled refreshes, and expose cached articles through a PHP function plus a read-only REST endpoint for Part 2.

The remote request targets the paginated Spaceflight News API v4 article collection with `limit=100`, `ordering=-published_at`, the saved `search`, and `published_at_gte` when a cutoff exists. The first page is the complete active set at the assignment's 100-item cap; the plugin does not follow `next`, and it also applies the saved cutoff locally before replacing the cache.

### Key Technical Decisions

- KTD1. Use one normalized cache option rather than WordPress posts because cached stories are API-owned, read-only feed data.
- KTD2. Replace the cache only after a complete, valid response has been normalized; errors leave last-known-good data untouched.
- KTD3. Use WordPress HTTP, Settings, Cron, REST, nonce, capability, sanitization, and escaping APIs without third-party production dependencies.
- KTD4. Keep refresh orchestration in a service class and presentation/registration in focused classes so behavior can be unit-tested with WordPress function stubs.
- KTD5. Bound collection to 100 newest matches per successful refresh to control option size and API usage for this test assignment.
- KTD6. Treat all remote fields as untrusted: retain bounded plain text, allow only HTTP(S) URLs and valid timestamps, drop invalid records, and require consumers to escape for their output context.
- KTD7. Serialize cron and manual refreshes with a short-lived lock so overlapping triggers do not amplify rate-limit usage or race cache writes.

### Implementation Units

### U1. Plugin foundation and settings model

- **Goal:** Register activation/deactivation behavior, defaults, settings sanitization, and the cron frequency choices.
- **Files:** `spaceflight-news-cache/spaceflight-news-cache.php`, `spaceflight-news-cache/includes/class-sfn-cache-plugin.php`, `spaceflight-news-cache/includes/class-sfn-cache-settings.php`
- **Requirements:** R1, R2, R3, R11, R12
- **Test scenarios:** defaults are stable; whitespace is trimmed; invalid dates are rejected to an empty cutoff; unsupported frequencies fall back safely; rescheduling removes the old hook before adding the selected interval.
- **Depends on:** None.

### U2. Remote collection and atomic local cache

- **Goal:** Fetch, validate, normalize, deduplicate, filter, sort, and atomically replace cached articles while recording operational status.
- **Files:** `spaceflight-news-cache/includes/class-sfn-cache-fetcher.php`, `spaceflight-news-cache/includes/class-sfn-cache-store.php`
- **Requirements:** R6, R7, R8, R9, R10, R14
- **Test scenarios:** valid results normalize required fields; duplicates collapse by source ID; cutoff removes older items; results sort newest-first; markup, unsafe URL schemes, invalid timestamps, oversized responses, timeouts, and malformed envelopes are rejected while preserving the previous cache; overlapping refreshes return an in-progress result; a valid empty response intentionally clears the active cache.
- **Depends on:** U1.

### U3. Admin operations and visibility

- **Goal:** Provide a Settings admin page with configuration controls, status, error feedback, and a nonce-protected manual refresh action.
- **Files:** `spaceflight-news-cache/includes/class-sfn-cache-admin.php`
- **Requirements:** R1, R2, R3, R4, R5
- **Test scenarios:** every admin surface requires `manage_options`; settings fields render escaped values; manual refresh checks capability before nonce, then redirects with a result notice; status shows timestamps, count, and latest error.
- **Depends on:** U1, U2.

### U4. Stable Part 2 consumption interface

- **Goal:** Expose cached articles through a documented PHP helper and public read-only REST route without triggering remote requests.
- **Files:** `spaceflight-news-cache/includes/class-sfn-cache-api.php`, `spaceflight-news-cache/README.md`
- **Requirements:** R13, R14
- **Test scenarios:** helper and REST route return the same newest-first normalized collection; REST response is public and read-only; reading never invokes the upstream API.
- **Depends on:** U2.

### U5. Automated verification harness

- **Goal:** Protect feature behavior using lightweight WordPress stubs and executable PHP tests, with static fallback checks documented for environments lacking PHP.
- **Files:** `spaceflight-news-cache/tests/bootstrap.php`, `spaceflight-news-cache/tests/test-settings.php`, `spaceflight-news-cache/tests/test-fetcher.php`, `spaceflight-news-cache/tests/test-admin.php`, `spaceflight-news-cache/tests/test-api.php`, `spaceflight-news-cache/tests/run.php`
- **Requirements:** R1-R14
- **Test scenarios:** exercise the scenarios named by U1-U4 and fail with a non-zero exit code on regression.
- **Depends on:** U1-U4.

### Risks and Mitigations

- The API query vocabulary can change; keep the endpoint and query construction filterable and validate the returned envelope before replacing cache data.
- Remote responses can be slow or oversized; use a short timeout, bounded redirects, and a response-size limit before decoding.
- Cron and manual refreshes can overlap; share a short-lived lock and always release it after completion, with expiry providing stale-lock recovery.
- WP-Cron is traffic-driven; show the next scheduled run and provide manual refresh so administrators can verify and recover operation.
- Large images and summaries can inflate options; retain URLs/text only and cap the active cache at 100 records.
- Trial font licensing is unrelated to this backend phase and remains untouched for Part 2.

### Verification Contract

| Gate | Applies to | Command | Done signal |
|---|---|---|---|
| PHP syntax | All plugin PHP | `docker run --rm -v ${PWD}:/app -w /app php:8.2-cli sh -c "find spaceflight-news-cache -name '*.php' -print0 | xargs -0 -n1 php -l"` | Every file reports no syntax errors. |
| Unit behavior | U1-U5 | `docker run --rm -v ${PWD}:/app -w /app php:8.2-cli php spaceflight-news-cache/tests/run.php` | Test runner exits zero with all assertions passing. |
| WordPress smoke | U1-U4 | Activate the mounted plugin in a disposable WordPress environment and request its REST route. | Activation has no fatal error and the route returns a valid JSON collection; report an environment limitation if a disposable WordPress runtime is unavailable. |
| Source hygiene | All units | `git diff --check` | No whitespace errors. |

### Definition of Done

- D1. All R1-R14 requirements are represented by completed implementation units.
- D2. The plugin activates without fatal errors on a supported WordPress/PHP 8.x environment, verified by the smoke gate when the runtime is available.
- D3. A successful refresh yields a normalized, deduplicated, newest-first local cache.
- D4. A failed refresh preserves the last-known-good cache and leaves an actionable admin error.
- D5. Cron rescheduling, deactivation cleanup, and manual refresh are implemented safely.
- D6. The PHP helper and REST route expose cache data without a live API request.
- D7. Verification Contract gates pass or any environment limitation is explicitly reported with substitute evidence.
