## 2026-07-12 - [Optimization of Global Layout Components]

**Learning:** Extracting static arrays (navigation lists) outside of component definitions and using `React.memo` for frequently used but stable UI components like `InternalLink` reduces CPU overhead and GC pressure. This is particularly effective in global components like `Header` and `Footer` that stay mounted but may re-render due to local state (e.g., mobile menu toggles).
**Action:** Always extract static data outside of render functions and memoize shared UI components that receive stable props.

## 2026-07-13 - [Production Stack Distinction: React vs Astro]
**Learning:** In a dual-stack environment (React/Vite SPA + Astro), it is critical to identify the true production surface for performance wins. Optimizing React components in the root directory may only affect internal SPAs or specific "islands," while the primary public-facing site is built from the `astro/` directory.
**Action:** Always verify which directory (root or `astro/`) is used for the production build and target optimizations (like LCP `fetchpriority` or `loading` strategies) accordingly.
