## 2025-05-30 - Granular Vendor Chunk Splitting

**Learning:** Default Vite chunking often creates a single massive vendor bundle. Splitting this manually into `vendor-core` (React, Router, etc.) and specialized chunks (motion, markdown, security) significantly reduces the initial JS payload. However, using `splitVendorChunkPlugin()` alongside complex `manualChunks` can cause circular dependency warnings and inconsistent chunking.
**Action:** Always define a custom `manualChunks` strategy for production apps and remove `splitVendorChunkPlugin()` when doing so to ensure precise control over bundle distribution.

## 2025-05-30 - Deferring Global Layout Dependencies

**Learning:** Components used in the global layout (like Header or Layout) are part of the critical rendering path for every page. Including heavy libraries like or in these components forces them into the main bundle. Replacing animations with CSS and lazy-loading non-critical UI elements (like modals) ensures the initial payload remains small.
**Action:** Use CSS transitions for header/menu animations instead of JS libraries. Lazy-load global modals and their associated third-party libraries.

## 2025-05-31 - Replacing framer-motion with CSS for Critical Path Performance
**Learning:** For high-traffic entry points like the Homepage and hundreds of Service pages, the ~33KB (gzipped) cost of `framer-motion` on the critical path is unnecessary. Simple reveal animations and state-based transitions can be achieved with pure CSS keyframes and standard Intersection Observers.
**Action:** Avoid using JS-based animation libraries for above-the-fold or high-frequency page templates. Use CSS keyframes and the Intersection Observer API to maintain "on-scroll" reveal effects without the JS payload.
