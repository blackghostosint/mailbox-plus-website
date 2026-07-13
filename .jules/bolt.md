## 2026-07-12 - [Production Stack Distinction: React vs Astro]
**Learning:** In a dual-stack environment (React/Vite SPA + Astro), it is critical to identify the true production surface for performance wins. Optimizing React components in the root directory may only affect internal SPAs or specific "islands," while the primary public-facing site is built from the `astro/` directory.
**Action:** Always verify which directory (root or `astro/`) is used for the production build and target optimizations (like LCP `fetchpriority` or `loading` strategies) accordingly.
