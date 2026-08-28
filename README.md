# Kunal Karankal — Portfolio

Fast, Vercel-ready static portfolio for a Mechanical Design Engineer focused on CAD automation, product R&D, and remote opportunities.

## Structure

- `index.html` contains the responsive portfolio application and lightweight interaction code.
- `assets/` contains content-hashed images and downloadable PDF records. Heavy files are no longer embedded in the HTML response.
- `vercel.json` adds long-lived browser caching for content-hashed assets and basic response security headers.

Certificate previews are lazy-loaded. PDF records load only when a visitor opens or downloads one.

## Vercel settings

- Framework Preset: Other
- Root Directory: repository root
- Build Command: leave empty
- Output Directory: leave empty

The website entry point is `index.html`.
