## 2026-07-12 - [Optimization of Global Layout Components]

**Learning:** Extracting static arrays (navigation lists) outside of component definitions and using `React.memo` for frequently used but stable UI components like `InternalLink` reduces CPU overhead and GC pressure. This is particularly effective in global components like `Header` and `Footer` that stay mounted but may re-render due to local state (e.g., mobile menu toggles).
**Action:** Always extract static data outside of render functions and memoize shared UI components that receive stable props.
