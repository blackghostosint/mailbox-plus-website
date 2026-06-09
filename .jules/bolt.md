## 2025-05-30 - Granular Vendor Chunk Splitting

**Learning:** Default Vite chunking often creates a single massive vendor bundle. Splitting this manually into `vendor-core` (React, Router, etc.) and specialized chunks (motion, markdown, security) significantly reduces the initial JS payload. However, using `splitVendorChunkPlugin()` alongside complex `manualChunks` can cause circular dependency warnings and inconsistent chunking.
**Action:** Always define a custom `manualChunks` strategy for production apps and remove `splitVendorChunkPlugin()` when doing so to ensure precise control over bundle distribution.
