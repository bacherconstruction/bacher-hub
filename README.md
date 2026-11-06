# Bacher Hub

Single-file web app for Bacher Construction: jobs, time clock, dispatch, scale house, fleet, inventory, stone shop, billing.

- `index.html` — the whole app (data lives in Supabase, table `docs`)
- `sw.js` — service worker (network-first, offline fallback, push alerts)
- `manifest.webmanifest`, `icons/` — install-to-home-screen
- `_redirects`, `_headers` — Netlify rules

Deploys to hub.bacherconstruction.ca via Netlify on every push to `main`. No build step.
