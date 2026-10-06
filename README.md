# Kunal Karankal — Portfolio

Fast, Vercel-ready static portfolio for a Mechanical Design Engineer focused on CAD automation, product R&D, and remote opportunities.

## Structure

- `index.html` contains the responsive portfolio application and lightweight interaction code.
- `assets/` contains content-hashed images and downloadable PDF records. Heavy files are no longer embedded in the HTML response.
- `vercel.json` adds long-lived browser caching for content-hashed assets and basic response security headers.

Certificate previews are lazy-loaded. PDF records load only when a visitor opens or downloads one.

The interface includes a floating exploded-assembly hero, illustrated project cards with pointer-responsive depth, live reading progress, animated career metrics, and route transitions. Reference concept illustrations are stored as content-hashed WebP assets and labeled on the page; they do not represent actual project photographs, manufacturer assembly drawings, or simulation results.

Every case study includes a visual introduction. Experience includes an exploded-view gallery for an RMU, a GIS bay, and a filtration pressure vessel. RMU and GIS panels also expand to show the original public CG product photographs with attribution. Six academic records now have first-page previews in addition to the existing certificate images and full PDF downloads. Images have intrinsic dimensions and descriptive alternative text.

## Public visual references

- [CG Power ring main unit](https://www.cgglobal.com/products/ring-main-unit): exterior reference for the RMU concept; original product photograph © CG Power and Industrial Solutions Ltd.
- [CG Power GIS switchgear](https://www.cgglobal.com/products/gis-switchgear): exterior reference for the GIS concept; original product photograph © CG Power and Industrial Solutions Ltd.
- [Pall Power Generation catalog](https://www.pall.com/content/dam/pall/power-%26-utilities/literature-library/non-gated/redirects/PowerGeneration_Catalog2.pdf#page=18): Industrial Housing Designs, printed page 10 (PDF page 18), informed the filtration-housing illustration. Simplified concept internals are not dimensioned manufacturing designs or evidence of personal design ownership.

Pointer-heavy effects are disabled on smaller screens. Reduced-motion preferences pause motion by default, with an explicit Enable motion control. Visitors can pause or resume motion at any time. Light and dark themes, mobile navigation, existing case studies, and document downloads remain available.

## Vercel settings

- Framework Preset: Other
- Root Directory: repository root
- Build Command: leave empty
- Output Directory: leave empty

The website entry point is `index.html`.

## Interactive models and motion

The on-demand 3D explorer provides five simplified procedural concept models: filtration pressure vessel, RMU, GIS, finned heat sink, and an energy-monitoring module. Visitors can rotate, zoom, switch between assembled/exploded states, adjust separation, inspect wireframes, and reset. These are illustrative models, not original manufacturer CAD assemblies. Three.js 0.180.0 and OrbitControls are served locally; their MIT license is included in assets. Rendering runs only when controls or layout change, with no continuous WebGL loop.

Motion controls remember a visitor's explicit preference. System reduced-motion preferences govern the first visit. Visible pages include floating workflow tabs and images, hover depth, and scroll reveals. Pause removes motion and reveals all content. The hero label sits above the model's motion area.
