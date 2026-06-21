# XLeRobot-Pro — Website

The XLeRobot-Pro project website. A plain static HTML/CSS site (no build step).

**Live:** https://minko82.github.io/xlerobot-pro-website/

## Pages
- `index.html` — Overview
- `components.html` — Components & Bill of Materials
- `build-guide.html` — Build & Calibration Guide
- `software.html` — Software setup
- `tutorial-first-reach.html` — First Reach tutorial
- `troubleshooting.html` — Troubleshooting

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
