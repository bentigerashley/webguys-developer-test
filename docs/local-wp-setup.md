# Local WP setup

These instructions use Local WP and the two plugin directories included in this repository. No database export is required.

## Prerequisites

- Local WP with a new site.
- ACF Pro.
- WPGraphQL.
- WPGraphQL for ACF.
- Node.js matching `frontend/.nvmrc`.

## Install the repository plugins

1. In Local, open the site's folder and locate `app/public/wp-content/plugins/`.
2. Copy `fdi-headless-cms/` and `spaceflight-news-cache/` into that plugins directory, or create directory junctions to the repository copies.
3. In WordPress, activate ACF Pro, WPGraphQL, WPGraphQL for ACF, FDI Headless CMS, and Spaceflight News Cache.

## Create the homepage record

1. Create and publish a page named **Home**.
2. Open **Settings -> Reading**, choose **A static page**, and select **Home** as the homepage.
3. Edit Home again and confirm the **Homepage Content** field group appears. Add representative sections and save.
4. Open `<local-site-url>/graphql` and run:

```graphql
query LocalHomepageSmoke {
  page(id: "/", idType: URI) {
    databaseId
    homepageContent { sections { __typename } }
  }
}
```

The response should contain the Home page and its saved section type names.

## Populate the news cache

1. Open **Settings -> Spaceflight News**.
2. Configure **Search phrase**, **Date cutoff**, and **Update frequency**, then save. The plugin caps the fetched result set internally.
3. Run the manual refresh and confirm the screen reports a successful refresh and a nonzero cached count.
4. In GraphiQL, verify article-detail URLs:

```graphql
query LocalNewsSmoke {
  spaceflightNews(limit: 3) {
    title
    url
  }
}
```

Each `url` should be an HTTP(S) publisher article, not `api.spaceflightnewsapi.net`.

## Connect Next.js

Create `frontend/.env.local`:

```dotenv
WORDPRESS_GRAPHQL_URL=http://your-local-site.local/graphql
```

Prefer Local's HTTP URL for this local server-to-server request. If HTTPS is required, trust Local's root certificate in Windows before starting Node; otherwise Node may reject the self-signed certificate and the frontend will use fallback data.

Restart the frontend after changing the environment file:

```powershell
cd frontend
npm ci
npm run dev
```

First open the GraphQL endpoint directly and confirm the smoke queries work. Then load `http://localhost:3000/`; the page includes a visually hidden source marker whose value becomes `wordpress` when the GraphQL response is accepted. Browser content alone is not sufficient because fallback content deliberately keeps the page usable.

## Reproduce release validation

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-release.ps1
```

The script runs locked dependency installation, lint, typecheck, frontend tests, standalone build, and PHP tests. It uses local PHP when available; otherwise it requires a running Docker Desktop daemon and the `php:8.2-cli` image.
