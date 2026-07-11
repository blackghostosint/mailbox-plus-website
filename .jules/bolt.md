## 2026-07-11 - [Deterministic Anchor Text]

**Learning:** Using Math.random() in render-related utilities causes React hydration mismatches in SSR/SSG environments (like Astro + React), leading to expensive full-page re-renders on the client.
**Action:** Always use deterministic logic (e.g., string hashing) for stable UI output across server and client.
