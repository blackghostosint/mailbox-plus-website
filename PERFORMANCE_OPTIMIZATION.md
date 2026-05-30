# Mailbox Plus Website Performance Optimization Plan

## Summary of Findings
- **Build Analysis**: Main entry chunk `index-DVOboQIl.js` is 615.86 kB (161.88 kB gzipped) - exceeds recommended 500 kB limit. Additional large chunks: `calendar-Pql3W9Qm.js` (186.44 kB), `markdown-Cd978uNB.js` (156.62 kB), `motion-BmJIzS8s.js` (129.89 kB).
- **Images**: No unoptimized images found in `public/` or `src/` directories.
- **Vite Configuration**: `splitVendorChunkPlugin` is disabled because `manualChunks` is configured as an object. Current code splitting is insufficient for the main chunk.
- **Dependencies**: Unused dependency `resend`, plus several unused devDependencies.

---

## Prioritized Recommendations (Impact vs Effort)

### 1. Remove Unused Dependencies (High Impact, Low Effort)
**Impact**: Reduces bundle size, simplifies dependency tree.  
**Effort**: 15 minutes.  
**Actions**:
- Remove unused production dependency: `resend` (not imported anywhere in the codebase)
- Remove unused devDependencies:
  - `@svgr/plugin-jsx` (not used)
  - `@typescript-eslint/eslint-plugin` (not used)
  - `@typescript-eslint/parser` (not used)
  - `autoprefixer` (Tailwind CSS v3+ handles vendor prefixes automatically)
  - `postcss` (only needed if custom PostCSS config exists, which it doesn't)

Run after removal: `npm prune` to clean up node_modules.

---

### 2. Fix Vite Code Splitting Configuration (High Impact, Medium Effort)
**Impact**: Reduces main chunk size from 615 kB to < 500 kB, improves initial load time.  
**Effort**: 1-2 hours.  
**Issues**:
- `splitVendorChunkPlugin()` is disabled because `manualChunks` is configured as an object (build warning confirms this)
- Current `manualChunks` only splits 4 small chunks, leaving the main entry chunk too large
- `chunkSizeWarningLimit: 700` suppresses warnings for chunks that are still too large

**Actions**:
1. Remove `splitVendorChunkPlugin()` from plugins (it has no effect)
2. Replace object-form `manualChunks` with function-form to enable better splitting:
   ```typescript
   manualChunks(id) {
     // Split vendor libraries
     if (id.includes('node_modules')) {
       if (id.includes('framer-motion')) return 'motion';
       if (id.includes('react-markdown') || id.includes('remark-gfm')) return 'markdown';
       if (id.includes('react-calendar') || id.includes('calendar')) return 'calendar';
       if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor';
       return 'vendor-misc';
     }
     // Split large page/component chunks by route
     if (id.includes('src/pages/')) {
       const pageName = id.split('src/pages/')[1].split('/')[0];
       return `page-${pageName}`;
     }
   }
   ```
3. Lower `chunkSizeWarningLimit` to 500 kB to catch oversized chunks
4. Use dynamic `import()` for large pages/components that are not needed for initial render (e.g., `ContactUs`, `AboutUs`, `Terms` pages)

---

### 3. Implement Route-Based Code Splitting (High Impact, Medium Effort)
**Impact**: Only loads code for the current route, reduces initial bundle size by 30-40%.  
**Effort**: 1 hour.  
**Actions**:
- Wrap page components in `React.lazy()` and `Suspense` in the router configuration:
  ```typescript
  const Home = React.lazy(() => import('@/pages/Home'));
  const ContactUs = React.lazy(() => import('@/pages/ContactUs'));
  // Repeat for all page routes
  ```
- Add a fallback loading state for `Suspense`

---

### 4. Optimize Large Chunks (Medium Impact, Low Effort)
**Impact**: Reduces size of specific large chunks.  
**Effort**: 30 minutes.  
**Actions**:
- **Calendar chunk (186 kB)**: Check if `react-calendar` can be replaced with a lighter alternative, or lazy load it only on pages that use it.
- **Markdown chunk (156 kB)**: `react-markdown` + `remark-gfm` is heavy. Consider using a lighter markdown parser if full GFM support isn't needed, or lazy load it only for article pages.
- **Motion chunk (129 kB)**: `framer-motion` is heavy but widely used. Consider tree-shaking unused animation features, or lazy load motion components only where needed.

---

### 5. Enable Compression and Cache Headers (Medium Impact, Low Effort)
**Impact**: Reduces transfer size, improves repeat visit performance.  
**Effort**: 30 minutes.  
**Actions**:
- Ensure the hosting provider (e.g., Vercel, Netlify) enables Brotli/Gzip compression for all static assets.
- Set long cache headers for hashed chunk files (e.g., `Cache-Control: max-age=31536000, immutable`).

---

## Implementation Order
1. Remove unused dependencies (quick win)
2. Fix Vite code splitting configuration
3. Implement route-based code splitting
4. Optimize large chunks
5. Enable compression/cache headers

## Expected Results
- Main chunk size reduced from 615 kB to < 400 kB
- Initial load time improved by 30-40%
- No more suppressed chunk size warnings
- Cleaner dependency tree
