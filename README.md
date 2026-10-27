# XLeRobot-Pro — Website

The XLeRobot-Pro project website. A plain static HTML/CSS site (no build step).

**Live:** https://minko82.github.io/xlerobot-pro-website/

## Pages
- `index.html` — Overview
- `components.html` — Components: parts list and print files
- `build-guide.html` — Build Guide
- `software.html` — Software Setup
- `tutorial-first-reach.html` — First Reach Tutorial
- `troubleshooting.html` — Troubleshooting
- `404.html` — Page not found (GitHub Pages serves it for any missing path)

Every page shares `styles.css` and `site.js`. After editing either one, bump the
`?v=` number on its link in every page, or returning visitors keep the old copy.

## Run locally
Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy
Every push to `main` publishes to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — the files are
served as-is, with no build step.
