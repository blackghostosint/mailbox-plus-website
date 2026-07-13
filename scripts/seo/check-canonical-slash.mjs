import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TARGET_HOST = 'mailboxplusohio.com';

// Recursively walks directory to find all .html files
function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function main() {
  console.log('==================================================');
  console.log('    SEO CANONICAL TRAILING-SLASH INTEGRITY CHECK  ');
  console.log('==================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Error: Build output directory "${DIST_DIR}" does not exist.`);
    console.error('Please run "npm run build" before running the SEO canonical check.\n');
    process.exit(1);
  }

  const htmlFiles = getHtmlFiles(DIST_DIR);
  console.log(`ℹ️ Scanned ${htmlFiles.length} HTML files from dist/`);

  let totalFailures = 0;
  let hasErrors = false;

  const linkRegex = /<link\s+([^>]+)>/gi;
  const relCanonicalRegex = /rel=["']canonical["']/i;
  const hrefRegex = /href=["']([^"']+)["']/i;

  const scriptRegex =
    /<script\s+[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;

  for (const file of htmlFiles) {
    const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');

    // --- A) Parse rel=canonical ---
    const linkMatches = [...content.matchAll(linkRegex)];
    for (const match of linkMatches) {
      const attrs = match[1];
      if (relCanonicalRegex.test(attrs)) {
        const hrefMatch = hrefRegex.exec(attrs);
        if (hrefMatch) {
          const href = hrefMatch[1].trim();

          // 1. Must be absolute http(s)
          let parsedUrl;
          try {
            parsedUrl = new URL(href);
            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
              throw new Error('Not http or https protocol');
            }
          } catch (e) {
            console.error(`❌ FAIL: canonical is not an absolute HTTP(S) URL in "${relPath}"`);
            console.error(`   - href: "${href}"`);
            hasErrors = true;
            totalFailures++;
            continue;
          }

          // 2. Trailing slash check if matching TARGET_HOST
          if (parsedUrl.host === TARGET_HOST) {
            const pathname = parsedUrl.pathname;
            if (pathname === '/') {
              // Home: pathname is '/'
            } else {
              // Non-home: assert ends with '/'
              if (!pathname.endsWith('/')) {
                console.error(`❌ FAIL: canonical path missing trailing slash in "${relPath}"`);
                console.error(`   - href: "${href}"`);
                hasErrors = true;
                totalFailures++;
              }
            }
          }
        }
      }
    }

    // --- B) Parse JSON-LD ---
    const scriptMatches = [...content.matchAll(scriptRegex)];
    for (const match of scriptMatches) {
      const scriptContent = match[1].trim();
      let json;
      try {
        json = JSON.parse(scriptContent);
      } catch (err) {
        console.error(`❌ FAIL: Invalid JSON-LD syntax in "${relPath}"`);
        console.error(`   - Error: ${err.message}`);
        hasErrors = true;
        totalFailures++;
        continue;
      }

      function validateJsonLdValue(value, keyPath) {
        if (typeof value !== 'string') return;

        // Try parsing URL, or check if it starts with origin/protocol
        let parsedUrl;
        try {
          parsedUrl = new URL(value);
        } catch (e) {
          // Not an absolute URL, check if it starts with '//' or other protocol
          return;
        }

        // Only validate if host matches target host
        if (parsedUrl.host !== TARGET_HOST) {
          return;
        }

        const pathname = parsedUrl.pathname;

        // Skip static files/assets (they do not get normalized with trailing slashes)
        const hasFileExtension = /\.(webp|png|jpg|jpeg|svg|gif|ico|xml|pdf|json|css|js)$/i.test(
          pathname
        );
        if (hasFileExtension) {
          return;
        }

        // "pathname length > 1 AND that look like page paths (not only '#' on origin with empty path)"
        if (pathname.length > 1 && pathname !== '/') {
          // Assert pathname ends with '/'
          if (!pathname.endsWith('/')) {
            console.error(`❌ FAIL: JSON-LD "${keyPath}" missing trailing slash in "${relPath}"`);
            console.error(`   - value: "${value}"`);
            hasErrors = true;
            totalFailures++;
          }
        }
      }

      function traverse(obj, currentPath = '') {
        if (!obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            traverse(item, `${currentPath}[${index}]`);
          });
          return;
        }

        for (const key of Object.keys(obj)) {
          const keyPath = currentPath ? `${currentPath}.${key}` : key;
          const val = obj[key];

          if (key === '@id' || key === 'url') {
            validateJsonLdValue(val, keyPath);
          }

          traverse(val, keyPath);
        }
      }

      traverse(json);
    }
  }

  console.log('\n--- Check Summary ---');
  console.log(`ℹ️ Total HTML files scanned: ${htmlFiles.length}`);

  if (hasErrors) {
    console.error(`\n❌ SEO canonical check FAILED with ${totalFailures} errors.`);
    console.log('==================================================\n');
    process.exit(1);
  } else {
    console.log('\n🎉 SEO canonical check PASSED successfully!');
    console.log('==================================================\n');
    process.exit(0);
  }
}

main();
