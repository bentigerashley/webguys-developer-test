# Developer Test — Headless WordPress + Next.js

This repository contains both parts of the developer test:

- `spaceflight-news-cache/` — rate-limit-safe local news cache with REST and WPGraphQL interfaces.
- `fdi-headless-cms/` — code-registered ACF flexible homepage layouts.
- `frontend/` — Figma-matched Next.js Pages Router frontend.

See each directory’s README for setup. The frontend runs independently with representative fallback content, so reviewers can evaluate the design without provisioning WordPress first.

## Delivery

- [Staging CI/CD and SSH server setup](docs/deployment.md)
- [Local WP setup and backend verification](docs/local-wp-setup.md)

Run the same release gates used by CI from PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-release.ps1
```

This checkout is not currently connected to a GitHub remote or staging server. A GitHub link and staging URL become available only after the repository owner completes the credentialed steps in the deployment guide.
