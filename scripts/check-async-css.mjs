import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

let totalPages = 0;
let checkedLinks = 0;
let errors = 0;

const targetFontUrl =
  'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap';

function walk(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const filepath = path.join(currentDir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath);
    } else if (stat.isFile() && file.endsWith('.html')) {
      totalPages++;
      const html = fs.readFileSync(filepath, 'utf-8');

      // Check for exact DM Sans Google Font from BaseLayout
      const hasGoogleFont = html.includes(targetFontUrl);
      if (hasGoogleFont) {
        const hasFontsPreload = html.includes(`rel="preload" as="style" href="${targetFontUrl}"`);
        const hasFontsOnload = html.includes('onload="this.onload=null;this.rel=\'stylesheet\'"');
        const hasFontsNoscript = html.includes(
          `<noscript><link rel="stylesheet" href="${targetFontUrl}"`
        );

        if (!hasFontsPreload || !hasFontsOnload || !hasFontsNoscript) {
          console.error(`[Error] Incorrect Google Fonts async loading pattern in: ${filepath}`);
          errors++;
        }
      }

      // Check for any bare stylesheet links to /_astro/
      // By extracting all noscript blocks first so we can check links outside of noscript
      const noscriptBlocks = [];
      const cleanHtml = html.replace(/<noscript[\s\S]*?<\/noscript>/gi, (match) => {
        noscriptBlocks.push(match);
        return '<!-- NOSCRIPT PLACEHOLDER -->';
      });

      // Find any link tags in the rest of the HTML that have /_astro/ and end with .css
      const linkRegex = /<link[^>]+>/gi;
      let match;
      while ((match = linkRegex.exec(cleanHtml)) !== null) {
        const linkTag = match[0];
        const isStyleSheet =
          /rel=["']?stylesheet["']?/i.test(linkTag) &&
          /href=["']?(\/_astro\/[^"'\s>]+.css)["']?/i.test(linkTag);
        if (isStyleSheet) {
          checkedLinks++;
          // A valid stylesheet link outside <noscript> must have media="print" and onload="this.media='all'"
          const hasMediaPrint = /media=["']?print["']?/i.test(linkTag);
          const hasOnload = /onload=["']?this\.media\s*=\s*['"]all['"]["']?/i.test(linkTag);

          if (!hasMediaPrint || !hasOnload) {
            console.error(
              `[Error] Bare (render-blocking) stylesheet found in: ${filepath}\n  Tag: ${linkTag}`
            );
            errors++;
          }
        }
      }
    }
  }
}

console.log('[Verification Script] Starting post-build async CSS checks...');
walk(distDir);
console.log(
  `[Verification Script] Completed. Checked ${totalPages} pages and ${checkedLinks} async stylesheet links.`
);

if (errors > 0) {
  console.error(
    `[Verification Script] FAILED: Found ${errors} non-render-blocking CSS layout validation errors.`
  );
  process.exit(1);
} else {
  console.log(
    '[Verification Script] SUCCESS: All pages loaded Google Fonts and Astro global CSS asynchronously and safely!'
  );
  process.exit(0);
}
