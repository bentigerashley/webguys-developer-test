# FDI headless frontend

Pages Router frontend for the FDI homepage design.

## Run locally

```bash
npm install
npm run dev
```

The complete page uses representative fallback content when `WORDPRESS_GRAPHQL_URL` is not set. To connect WordPress, set it to the public WPGraphQL endpoint, for example `http://wordpress.test/graphql`.

Required WordPress plugins:

- ACF Pro
- WPGraphQL
- WPGraphQL for ACF
- `fdi-headless-cms` from this repository
- `spaceflight-news-cache` from this repository

The page is statically generated and revalidates every 60 seconds. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before delivery. Production builds use Next.js standalone output for SSH deployment.
