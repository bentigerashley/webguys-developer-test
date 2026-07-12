# Fallback source provenance

Retrieved 2026-07-13 for the bounded source-content correction.

## ADH Build homepage

Source: https://adhbuild.com/

The indexed homepage identifies the brand as ADH Build and includes “Your Workplace, Reimagined,” “Since 1986,” and the description of ADH as a workplace fit-out contractor across MENA. It lists these portfolio entries: Deloitte Amman Offices, Bayer Cairo, World Bank, Talabat, and Confidential Client. Its services are Design, Interior Fit Out, Design & Build, Furniture Supply, and IT/AV/SEC Solutions.

Only those supported identity facts, labels, and portfolio names are adopted in fallback content. Precise contact details and unsupported awards are omitted.

## Spaceflight News API capture

Source request: `GET https://api.spaceflightnewsapi.net/v4/articles/?limit=3&ordering=-published_at`

The immutable capture used by the fallback is stored in `data/spaceflight-news-capture.json`. It preserves the IDs, titles, summaries, image URLs, publication timestamps, news sites, and article URLs returned together by the API; tests compare the runtime fallback directly with that independent fixture.

| ID | Title | News site | Published | Article URL |
|---|---|---|---|---|
| 38920 | NASA’s Roman telescope into prelaunch servicing following arrival in Florida | NASASpaceflight | 2026-07-12T20:46:22Z | https://www.nasaspaceflight.com/2026/07/roman-prelaunch-update/ |
| 38919 | What’s Happening in Space Policy July 12-18, 2026 | SpacePolicyOnline.com | 2026-07-12T20:30:29Z | https://spacepolicyonline.com/news/whats-happening-in-space-policy-july-12-18-2026/ |
| 38918 | Parabilis tests propulsion system for maneuverable cubesats | SpaceNews | 2026-07-11T13:39:38Z | https://spacenews.com/parabilis-tests-propulsion-system-for-maneuverable-cubesats/ |

The API endpoint is capture provenance only. Card destinations are the individual article URLs in the final column.
