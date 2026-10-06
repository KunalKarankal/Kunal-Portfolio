# Kunal Karankal — Portfolio

Fast, Vercel-ready static portfolio for a Mechanical Design Engineer focused on CAD automation, product R&D, and remote opportunities.

## Structure

- `index.html` contains the responsive portfolio application and lightweight interaction code.
- `assets/` contains content-hashed images and downloadable PDF records. Heavy files are no longer embedded in the HTML response.
- `vercel.json` adds long-lived browser caching for content-hashed assets and basic response security headers.

Certificate previews are lazy-loaded. PDF records load only when a visitor opens or downloads one.

The interface includes a floating exploded-assembly hero, illustrated project cards with pointer-responsive depth, live reading progress, animated career metrics, and route transitions. Four original AI concept illustrations are stored as content-hashed WebP assets and labeled as concept artwork on the page; they do not represent actual project photographs or simulation results.

Pointer-heavy effects are disabled on smaller screens. Reduced-motion preferences pause motion by default, with an explicit Enable motion control. Visitors can pause or resume motion at any time. Light and dark themes, mobile navigation, existing case studies, and document downloads remain available.

## Vercel settings

- Framework Preset: Other
- Root Directory: repository root
- Build Command: leave empty
- Output Directory: leave empty

The website entry point is `index.html`.
