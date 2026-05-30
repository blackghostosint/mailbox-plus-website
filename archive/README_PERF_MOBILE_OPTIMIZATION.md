# Mailbox Plus Mobile Optimization – Performance Branch

## Verification Steps

1. **Install dependencies and build:**
   ```sh
   npm install
   npm run build
   ```

2. **Run a local server:**
   ```sh
   npm run preview
   # or use `npx serve dist`
   ```

3. **Test with Lighthouse (Chrome DevTools):**
   - Open the local site in Chrome.
   - Open DevTools → Lighthouse → Mobile.
   - Run audits for Performance, Best Practices, SEO, and Accessibility.
   - Focus on:
     - **LCP**: Should be <2.5s for hero image.
     - **TBT**: Should be <200ms.
     - **FCP**: Should be <1.5s.
     - **Caching**: Check "Uses efficient cache policy" for /assets, /images, /fonts.
     - **JS Bundling**: Check "Reduce JavaScript execution time" and "Efficiently encode images".

4. **Verify:**
   - Fonts load non-blocking (check waterfall in Network tab).
   - All non-hero images are lazy-loaded.
   - Vendor, motion, and supabase chunks are split in the build output (`dist/assets`).
   - Netlify headers are present in deployed response headers.

---

## What Was Changed

- Non-blocking Google Fonts loading in [`index.html`](index.html)
- All routes code-split with `React.lazy` in [`src/App.tsx`](src/App.tsx)
- Added [`src/components/SmartImage.tsx`](src/components/SmartImage.tsx) and replaced hero/logo images in Home, Header, Footer
- Vite config: vendor chunking, minify, brotli, splitVendorChunkPlugin in [`vite.config.ts`](vite.config.ts)
- Netlify cache-control and preconnect headers in [`public/_headers`](public/_headers)

---

## Rollback

To revert, simply switch back to your main branch:
```sh
git checkout main