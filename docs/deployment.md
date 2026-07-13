# Staging deployment

The workflow in `.github/workflows/deploy-staging.yml` validates every push to `main` and every manual dispatch. It deploys only after lint, typecheck, frontend tests, PHP tests, and a standalone Next.js build succeed.

## GitHub repository setup

1. Create an empty GitHub repository, add it as `origin`, and push this feature branch.
2. Merge the branch into `main`. The workflow trigger covers direct pushes and merge commits landing on `main`.
3. Create a GitHub environment named `staging`. Add approval protection if desired.
4. Add these environment secrets:

   - `SSH_HOST`: staging hostname or IP.
   - `SSH_USER`: restricted deployment account.
   - `SSH_PRIVATE_KEY`: private half of a deploy-only SSH key.
   - `SSH_KNOWN_HOSTS`: output captured from a trusted channel with `ssh-keyscan -p <port> <host>`, verified against the server fingerprint before saving. A non-default port uses `[host]:port` entries.

5. Add `WORDPRESS_GRAPHQL_URL` as a repository variable so the validation build can access the public HTTPS WordPress GraphQL endpoint without entering the protected deployment environment.

6. Add these `staging` environment variables:

   - `SSH_PORT`: numeric port, normally `22`.
   - `DEPLOY_PATH`: absolute deployment root such as `/srv/fdi-frontend`; never `/`.
   - `DEPLOY_BASE`: fixed operator-owned parent such as `/srv`; `DEPLOY_PATH` must be a canonical descendant.
   - `SERVICE_NAME`: user-level systemd service, such as `fdi-frontend.service`.
   - `HEALTHCHECK_URL`: URL reachable from the server after restart, such as `http://127.0.0.1:3000/`.

The workflow has only `contents: read` permission, pins every action to a commit SHA, performs strict host verification, and serializes staging deployments.

## Server prerequisites

The target must provide Linux with GNU coreutils/findutils, OpenSSH, `bash`, `tar`, `curl`, Node.js 20 or newer, and user-level systemd. The deployment account needs write access only to `DEPLOY_PATH` and permission to restart its own service.

Create the deployment root and a user service. The service must run the active standalone server from the atomic `current` symlink:

```ini
[Unit]
Description=FDI Next.js staging
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/fdi-frontend/current
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=default.target
```

Save this as `~/.config/systemd/user/fdi-frontend.service`, then run:

```bash
systemctl --user daemon-reload
systemctl --user enable fdi-frontend.service
loginctl enable-linger "$USER"
```

The workflow uploads an immutable `<commit>.tgz`. `scripts/activate-release.sh` validates its inputs, takes an activation lock, extracts a new release, atomically switches `current`, restarts the service, runs the health check, and restores the previous symlink if activation fails. It retains the five newest releases.

## First deployment and verification

Use the workflow's manual dispatch after all environment settings exist, or merge to `main`. A successful job should end with `Activated release <commit>`.

Verify the public staging URL, then confirm the rendered page uses WordPress data after a revalidation interval. Do not print `WORDPRESS_GRAPHQL_URL` or any SSH secret in logs.

## Rollback

Pipe the included script from a trusted repository checkout to the server. With no fourth argument it selects the newest release other than `current`:

```bash
ssh deploy@staging.example "bash -s -- /srv/fdi-frontend /srv fdi-frontend.service http://127.0.0.1:3000/" < scripts/rollback-release.sh
```

To select a retained commit explicitly, pass its 40-character SHA as the fifth argument. The script atomically changes `current`, restarts the service, and requires a successful health check.

## Troubleshooting

- `SSH_KNOWN_HOSTS does not contain...`: regenerate the entry for the exact host and port and verify its fingerprint out of band.
- Build succeeds but WordPress data later falls back: confirm `.env.production` exists in the active release and the endpoint is reachable from the server.
- Service restart fails: inspect `systemctl --user status <service>` and `journalctl --user -u <service>`.
- Health check fails: run it from the staging host and verify the service port, reverse proxy, and application logs.

No GitHub or staging URL is claimed by this repository until the owner supplies those external resources.
