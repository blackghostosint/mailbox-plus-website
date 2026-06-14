## 2025-05-30 - Granular Vendor Chunk Splitting

**Learning:** Default Vite chunking often creates a single massive vendor bundle. Splitting this manually into `vendor-core` (React, Router, etc.) and specialized chunks (motion, markdown, security) significantly reduces the initial JS payload. However, using `splitVendorChunkPlugin()` alongside complex `manualChunks` can cause circular dependency warnings and inconsistent chunking.
**Action:** Always define a custom `manualChunks` strategy for production apps and remove `splitVendorChunkPlugin()` when doing so to ensure precise control over bundle distribution.

## 2025-05-30 - Deferring Global Layout Dependencies

**Learning:** Components used in the global layout (like Header or Layout) are part of the critical rendering path for every page. Including heavy libraries in these components forces them into the main bundle. Replacing animations with CSS and lazy-loading non-critical UI elements (like modals) ensures the initial payload remains small.
**Action:** Use CSS transitions for header/menu animations instead of JS libraries. Lazy-load global modals and their associated third-party libraries.

## 2026-06-11 - Critical Path Animation Library Removal

**Learning:** Using `framer-motion` for simple entry or rotation animations on a landing page (Home) adds ~129KB of JavaScript to the critical rendering path, even if the library is lazy-loaded elsewhere. Replacing these with pure CSS `@keyframes` and standard React state management achieves the same visual result with zero additional JS overhead for the animation itself.
**Action:** Prioritize CSS animations for critical "above the fold" interactions. Only use animation libraries like `framer-motion` for complex, interactive, or multi-stage animations that are non-critical to the initial page load.

## 2025-05-30 - Hero Timer Re-render Isolation
**Learning:** Placing a `setInterval` for a small UI element (like a rotating text) in a top-level page component causes the entire page (including static sections and complex sub-components) to re-render on every tick.
**Action:** Always encapsulate timer-based state in the smallest possible leaf component to contain re-renders. Use `React.memo` for neighboring sibling components if they are expensive to re-render.
