---
name: full-cycle-website
description: >-
  Use when you need to build and launch a complete, turnkey website
  autonomously: code, SEO, API documentation, git versioning, Docker, CI/CD,
  manual installation on a VPS/VDS/dedicated server (including servers that
  already run NGINX/Caddy and other sites), deploy key, a curl-based update
  script, SSL, and domain setup.
---
# Turnkey website: from idea to production

Goal: a working site on its domain over HTTPS, running in Docker, with an SEO baseline, API documentation, git history, manual installation guide, and an update script that runs with a single `curl` command. The site must coexist peacefully with existing sites and proxies on the server. It is done only when the acceptance checklist at the end passes.

## 0. Brief (ask once, decide the rest yourself)
Ask the user only for what you cannot infer:
- the site's purpose, pages, languages, target audience and region;
- the domain (the user registers it themselves, e.g. at reg.ru or Namecheap) and whether `www` is needed;
- the server: IP, SSH user, OS; whether it is fresh or already hosts other sites. Never ask for secrets in chat; only via secure input (environment variables);
- the repository (GitHub/GitLab/other), public or private, and where to send notifications;
- whether forms, a CMS, analytics (Google Analytics / Yandex Metrica), a backend, an API or a database are needed.
Choose everything else (stack, structure, configs) yourself and record it briefly in `docs/DECISIONS.md`.

## 1. Design: DESIGN.md
- The design system is produced by the user's separate skills and lives in `DESIGN.md` at the repository root (or wherever the user specifies).
- If `DESIGN.md` exists: read it before building any UI and follow it strictly (colors, typography, grid, spacing, components, tone). Do not rewrite or extend it on your own initiative; list any gaps and contradictions you find for the user.
- If there is no `DESIGN.md`: ask whether one is coming; if the user says not to wait, build a neutral, clean design and note this in the report.
- Move design tokens from `DESIGN.md` into CSS variables / theme config instead of hardcoding them.

## 2. Stack and Docker (mandatory)
- Content site / landing page: a static site generator (Astro, Next.js static export, Hugo) served by a lightweight container (nginx:alpine / caddy:alpine inside the app container).
- Dynamic: Next.js/Nuxt/Django/Laravel/FastAPI, etc.
- The whole application (site, backend, DB, workers) runs in Docker via `docker-compose.yml` (plus `docker-compose.prod.yml` if needed). Multi-stage `Dockerfile`, non-root user in the container, `HEALTHCHECK`, `restart: unless-stopped`, log limits (`max-size`).
- Isolation from other sites on the server:
  - a unique Compose project name (`name: <project>` / `COMPOSE_PROJECT_NAME`); all containers, networks and volumes prefixed with the project name;
  - the DB and internal services publish no ports externally, only on the project's internal network;
  - the web container is published only on `127.0.0.1:<APP_PORT>`, never on `0.0.0.0` and never on 80/443; `APP_PORT` is set in `.env`.
- Tag images with the version (`<project>:v1.2.3` and `:sha-<commit>`) so rollback is possible.

## 3. Repository and versioning
- `git init`, `.gitignore`, `.dockerignore`, `.editorconfig`, `README.md` (how to run locally, link to the install guide, the update command), `.env.example` with no real secrets.
- Branches: `main` = production; work happens in feature branches, merged via PR.
- Conventional Commits, semantic versioning (`v1.0.0`), `CHANGELOG.md`; tag releases.
- Linter, formatter, pre-commit hooks; tests covering at least the build, key pages and API endpoints.

## 4. Development
- Responsive layout per `DESIGN.md`, accessibility (alt text, contrast, semantic tags, heading order).
- Performance: optimized images (WebP/AVIF, `srcset`, lazy-load), minimal JS, static asset caching, fonts with `font-display: swap`.
- 404/500 pages, favicon and `site.webmanifest`.
- Forms: validation, spam protection (honeypot/captcha), delivery to email/Telegram configured via environment variables.
- A `/health` (or `/api/health`) endpoint for update checks and monitoring.
- Legal: a privacy policy and cookie consent if analytics are used (comply with applicable privacy laws such as GDPR or Russia's 152-FZ).

## 5. API documentation
If the site has an API (its own backend, form endpoints, webhooks), documentation is mandatory and lives in the repository:
- An OpenAPI 3 spec in `docs/api/openapi.yaml`, generated from code where the framework supports it (FastAPI, NestJS, drf-spectacular, etc.), otherwise hand-written and checked with a validator.
- `docs/API.md`: base URL, authentication, error formats, rate limits, API versioning (`/api/v1`), and for every endpoint: method, path, parameters, request body, responses with status codes, and `curl` examples.
- Interactive docs (Swagger UI / Redoc / Scalar) at `/api/docs`; in production, protect them with basic auth or an IP allowlist if the API is not public.
- CI checks that the spec is valid and matches the code.
- When the API changes, update the spec, `docs/API.md` and `CHANGELOG.md` in the same PR.

## 6. SEO
- `robots.txt` (with a link to the sitemap; disallow `/api/`, admin and internal paths; on staging, block indexing entirely).
- `sitemap.xml` generated automatically at build time.
- A unique `<title>` and `meta description` on every page, `canonical`, `hreflang` for multilingual sites, `lang` on `<html>`.
- Open Graph and Twitter Card, JSON-LD structured data (Organization, WebSite, BreadcrumbList, Product/Article as appropriate).
- Human-readable URLs, one canonical host (301 from www/non-www and from http to https), no redirect chains.
- Prepare instructions for the user: verify the site in Google Search Console and Yandex Webmaster, and submit the sitemap.

## 7. Server audit before installation (read-only)
Before writing the guide, if you have SSH access, build a picture of the server using read-only commands only; if you don't, make these commands the first step of the guide so the user can send you the output:
- OS and resources: `cat /etc/os-release`, `free -h`, `df -h`.
- Ports in use and who holds them: `ss -ltnp`.
- Host proxies: `systemctl is-active nginx caddy apache2 haproxy traefik`, `nginx -T` (list of `server_name`s), `caddy list-modules` / contents of `/etc/caddy/Caddyfile` and its included files.
- Proxies in Docker: `docker ps --format '{{.Names}} {{.Image}} {{.Ports}}'` (nginx-proxy, Traefik, Caddy, NPM on 80/443).
- Existing Compose projects, networks and volumes: `docker compose ls`, `docker network ls`, `docker volume ls`.
- Certificates already issued and what renews them (certbot timers, Caddy storage).
- Firewall: `ufw status` / `nft list ruleset`.
Based on the findings, pick one scenario:
- **A. Clean server.** Nothing on 80/443: install Caddy (default) or NGINX as a shared reverse proxy for all future sites, so later sites plug into the same one.
- **B. NGINX already on the host.** Do not install a second proxy. Add only your own file `/etc/nginx/sites-available/<domain>.conf` (or `conf.d/<domain>.conf`) with `proxy_pass http://127.0.0.1:<APP_PORT>`, symlink it into `sites-enabled`, and issue the certificate with `certbot --nginx -d <domain>` (or webroot), which touches only your own server block.
- **C. Caddy already on the host.** Add a separate site file (`/etc/caddy/sites/<domain>.caddy`) included via `import`; if there is no `import` yet, add a single `import sites/*` line to the main Caddyfile, keeping a backup.
- **D. The proxy runs in Docker (Traefik, nginx-proxy, Caddy-docker-proxy, NPM).** Attach the container to its network and describe the site with labels/variables (`VIRTUAL_HOST`, Traefik labels) instead of publishing a port; do not touch the proxy's own configuration.
- **E. Unknown or non-standard proxy, or a conflict that cannot be resolved safely.** Stop and describe the situation and the options to the user.
General conflict rules:
- Never bind 80/443 from the project's containers; never stop, restart or rewrite other sites, containers, certificates or configs.
- Pick a free `APP_PORT` (`ss -ltn` + check `docker ps`) from a range such as 8100–8999, and record it in `.env` and `docs/DECISIONS.md`.
- Before adding a domain, make sure that `server_name`/address is not already served by another config.
- Any proxy change: back up the file first, then validate (`nginx -t` / `caddy validate --config ...`), then `reload` only, never `restart`; if validation fails, roll back your file and do not reload.
- Do not change global server settings (SSH, firewall, Docker daemon) if the server is already set up and serving other sites; give hardening recommendations in a separate, optional section.

## 8. Manual installation: `docs/INSTALL.md`
The user performs installation manually, following a step-by-step guide the agent writes for the chosen scenario (A–E). Do not create a `curl | bash` installer. The guide must:
- give, for each step, exact copy-pasteable commands, a one-line explanation, and a command to verify the result;
- start with the audit (section 7) and branch explicitly by scenario;
- cover: installing Docker and Compose if missing (official Docker repository); creating a deploy user and the `/opt/<project>` (or `/srv/<project>`) directory; setting up the deploy key (section 9); cloning; filling in `.env` from `.env.example` with a free `APP_PORT`; the first `docker compose up -d --build` and the check `curl -fsS http://127.0.0.1:<APP_PORT>/health`; hooking into the proxy per scenario; DNS (section 10) and issuing SSL; setting up backups; verifying the site over HTTPS;
- for a clean server (scenario A), add baseline hardening: a sudo user, key-only login, ufw (22, 80, 443), fail2ban, automatic security updates, swap on low-memory machines;
- end with a "Troubleshooting" section covering common failures (port in use, `nginx -t` fails, certificate not issued due to DNS, unhealthy container) and how to roll back your changes without affecting other sites.
Commit proxy configs to the repository as templates: `deploy/nginx/site.conf.template`, `deploy/caddy/site.caddy.template`, `deploy/traefik/labels.example`.

## 9. Server access to the repository: deploy key (mandatory)
The server pulls code only via a dedicated deploy key bound to a single repository, never via the user's personal keys or tokens.
- On the server, as the deploy user: `ssh-keygen -t ed25519 -C "deploy@<domain>" -f ~/.ssh/<repo>_deploy -N ""`.
- Add a host alias to `~/.ssh/config` (`Host github-<repo>`, `HostName github.com`, `IdentityFile ~/.ssh/<repo>_deploy`, `IdentitiesOnly yes`) so several sites with their own keys can live on one server; add the host fingerprint to `known_hosts` via `ssh-keyscan`.
- Add the public key to the repository as a read-only deploy key (GitHub: Settings, Deploy keys, Allow write access off; GitLab: Settings, Repository, Deploy keys). If the agent has admin API access to the repository, add the key via the API (GitHub: `POST /repos/{owner}/{repo}/keys` with `read_only: true`) after the user agrees; otherwise state in the guide exactly where to paste the key.
- Verify: `ssh -T git@github-<repo>` and `git ls-remote git@github-<repo>:<owner>/<repo>.git`.
- The private key never leaves the server and never ends up in git, chat or CI logs.
- To trigger updates from CI, use a separate key (stored in CI secrets, public part in the deploy user's `authorized_keys`, ideally restricted with `command=` to the update script); don't confuse it with the deploy key.

## 10. Domain and DNS
The user registers the domain. Give them exact instructions for their registrar:
- an `A` record for `@` pointing to the server IP (plus `AAAA` if there is IPv6);
- `A` or `CNAME` for `www`;
- if email is hosted on the domain: MX, SPF, DKIM, DMARC.
Verify propagation with `dig`/`nslookup` and only then issue the SSL certificate.

## 11. Update script via curl: `deploy/update.sh`
The only automated script for the server: it updates an already installed site. Run it on the server as the deploy user:
```
curl -fsSL https://raw.githubusercontent.com/<owner>/<repo>/main/deploy/update.sh | bash -s -- --dir /opt/<project> --ref v1.2.3
```
For a private repository, the raw URL isn't reachable without auth; in that case the README command uses the local copy from the clone (`bash /opt/<project>/deploy/update.sh --ref v1.2.3`) or downloads a release asset; pick one and document it in the README and `docs/INSTALL.md`.
Requirements:
- `#!/usr/bin/env bash`, `set -euo pipefail`, clear messages for every step, a log in the project directory (`/opt/<project>/logs/update.log`).
- Options: `--dir` (install directory), `--ref` (branch, tag or commit; defaults to the latest tag or `main`), `--dry-run`, `--rollback`, `--yes`.
- Preflight checks: the directory exists and is a git clone of the right repository, `.env` is present, Docker is available, there is enough free disk space; otherwise stop without changing anything and point to `docs/INSTALL.md` for installation.
- Locking with `flock` so two updates never run at once.
- Steps: record the current commit and image tags; `git fetch` via the deploy key and `checkout` the requested `--ref`; diff `.env.example` against `.env` and warn about new variables (never overwrite `.env`); back up the DB before migrations; `docker compose pull`/`build`; `docker compose up -d` for your own project only (`-p <project>`); migrations; wait for `/health` on `127.0.0.1:<APP_PORT>` with a timeout.
- If the check fails: automatically roll back to the previous commit and images, re-check, exit non-zero with a clear message.
- If the update changed the proxy template: don't apply it silently; print the diff and the command to apply it manually (with `nginx -t`/`caddy validate` and `reload`), because the proxy is shared.
- Never touch other Compose projects, containers, networks, volumes or proxy configs; prune only your own project's old images, keeping the last N for rollback.
- At the end: version before and after, `/health` status, site URL, how to roll back (`--rollback`).
- The script passes `shellcheck`; testing it in a test environment (a container or VM with the same OS) is mandatory.

## 12. CI/CD
- CI on every PR: install dependencies, lint, test, build the Docker image, validate the API spec, `shellcheck` for `deploy/*.sh`.
- Release: a `vX.Y.Z` tag builds and pushes the image to a registry (if used) and creates a GitHub Release with the CHANGELOG.
- CD (if the user wants it): after a release, CI calls `deploy/update.sh --ref <tag> --yes` on the server over SSH and fails if the script returns an error. Do not enable auto-deploy without the user's consent; otherwise updates are run manually with the `curl` command.
- Optional: a staging environment on a subdomain with indexing blocked.
- Secrets live only in CI secrets and the server's `.env`, never in git.

## 13. Operations
- Backups: DB and uploaded files on a schedule (cron/systemd timer of the deploy user), stored off-server, with restore tested.
- Uptime monitoring (an uptime check on `/health`), Docker log limits, SSL expiry alerts.
- Analytics (Google Analytics / Yandex Metrica) with the user's consent.

## 14. Acceptance checklist (verify it yourself, don't just claim it)
- [ ] The UI matches `DESIGN.md` (if present); deviations are listed.
- [ ] Everything runs in Docker; the web container listens only on `127.0.0.1:<APP_PORT>`; the project does not occupy ports 80/443.
- [ ] Other sites and containers on the server work as they did before installation; the proxy config passes `nginx -t` / `caddy validate`.
- [ ] The site opens at `https://domain` and `https://www.domain` with a single canonical variant; http redirects to https.
- [ ] Valid SSL, auto-renewal configured.
- [ ] `robots.txt` and `sitemap.xml` are reachable and correct; meta, OG and JSON-LD are in place.
- [ ] Lighthouse: Performance, SEO, Accessibility and Best Practices at 90 or above (or an explanation why not).
- [ ] 404 works; no broken links.
- [ ] API docs: `openapi.yaml` is valid, `docs/API.md` is current, `/api/docs` opens, the `curl` examples work.
- [ ] The server pulls code via a read-only deploy key; no personal keys or tokens on the server.
- [ ] `docs/INSTALL.md` has been walked through step by step in a test environment for the relevant scenario.
- [ ] The `curl ... update.sh` command updates the site and automatically rolls back a broken release.
- [ ] A backup is created and restores successfully.
- [ ] The repository contains a README (with the update command), `docs/INSTALL.md`, DECISIONS, CHANGELOG, `docs/API.md`, `deploy/`; no secrets in git.

## 15. Report to the user
Briefly: links to the site, the repository and the API docs; the chosen server scenario and `APP_PORT`; a link to `docs/INSTALL.md`; the full `curl` update command; what the user still has to do by hand (installation steps, DNS at the registrar, the deploy key if the agent couldn't add it, verification in Google Search Console / Yandex Webmaster).

## Rules
- Get the user's approval for actions that change production or third-party accounts (DNS, deploy key via API, shared proxy config, data deletion, payments).
- On a shared server, change only what belongs to the project; anything shared (proxy, firewall, SSH) only with a backup, validation and consent.
- Never ask for passwords or keys in chat.
