## 2026-07-11 - [Deterministic Anchor Text]

**Learning:** Using Math.random() in render-related utilities causes React hydration mismatches in SSR/SSG environments (like Astro + React), leading to expensive full-page re-renders on the client.
**Action:** Always use deterministic logic (e.g., string hashing) for stable UI output across server and client.

## 2026-07-26 - [Async Stylesheets & Deferred Tracking]

**Learning:** Render-blocking global CSS and Google Fonts stylesheets delay First Contentful Paint (FCP), while early parsing of heavy third-party tracking scripts (GA4 and Meta Pixel) severely degrades Total Blocking Time (TBT) and Time to Interactive (TTI) on mobile devices.
**Action:** Implement post-build CSS rewrites (`media="print"` with onload swapping) alongside Google Font stylesheet preload links and noscript fallbacks. Defer third-party SDK downloads until interaction or browser idle using `requestIdleCallback` (with a 2s timeout fallback) while keeping immediate synchronous queuing buffers in `<head>` to prevent data loss.
