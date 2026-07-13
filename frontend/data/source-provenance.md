# Fallback source provenance

Inspected 2026-07-13 for the Figma content-fidelity correction.

## Figma design authority

Source: https://www.figma.com/design/EFx0NBu50PIC74FmHCYGDN/Developer-Test-%E2%80%93-Website_V1--Copy-?node-id=3-267

The authenticated `Homepage Full Design` frame is the authority for FDI identity, section order, and authored page copy. Verified strings include the dominant `FDI® RI` mark and the complete LinkedIn callout. The API-driven Latest News records remain exempt from static Figma transcription.

## Spaceflight News API capture

Source request: `GET https://api.spaceflightnewsapi.net/v4/articles/?limit=3&ordering=-published_at`

The immutable capture used by the fallback is stored in `data/spaceflight-news-capture.json`. It preserves the IDs, titles, summaries, image URLs, publication timestamps, news sites, and article URLs returned together by the API; tests compare the runtime fallback directly with that independent fixture.

| ID | Title | News site | Published | Article URL |
|---|---|---|---|---|
| 38920 | NASA’s Roman telescope into prelaunch servicing following arrival in Florida | NASASpaceflight | 2026-07-12T20:46:22Z | https://www.nasaspaceflight.com/2026/07/roman-prelaunch-update/ |
| 38919 | What’s Happening in Space Policy July 12-18, 2026 | SpacePolicyOnline.com | 2026-07-12T20:30:29Z | https://spacepolicyonline.com/news/whats-happening-in-space-policy-july-12-18-2026/ |
| 38918 | Parabilis tests propulsion system for maneuverable cubesats | SpaceNews | 2026-07-11T13:39:38Z | https://spacenews.com/parabilis-tests-propulsion-system-for-maneuverable-cubesats/ |

The API endpoint is capture provenance only. Card destinations are the individual article URLs in the final column.
