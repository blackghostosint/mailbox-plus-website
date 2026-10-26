import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveDistDir, getHtmlFiles } from '../lib/dist-path.mjs';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';

const TARGET_HOST = 'mailboxplusohio.com';

export function validateCanonicalHtml(content, targetHost = TARGET_HOST) {
  let totalFailures = 0;
  let hasErrors = false;

  const linkRegex = /<link\s+([^>]+)>/gi;
  const relCanonicalRegex = /rel=["']canonical["']/i;
  const hrefRegex = /href=["']([^"']+)["']/i;

  const scriptRegex =
    /<script\s+[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\b[^>]*>/gi;

  // --- A) Parse rel=canonical ---
  const linkMatches = [...content.matchAll(linkRegex)];
  for (const match of linkMatches) {
    const attrs = match[1];
    if (relCanonicalRegex.test(attrs)) {
      const hrefMatch = hrefRegex.exec(attrs);
      if (hrefMatch) {
        const href = hrefMatch[1].trim();

        let parsedUrl;
        try {
          parsedUrl = new URL(href);
          if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            throw new Error('Not http or https protocol');
          }
        } catch (_e) {
          hasErrors = true;
          totalFailures++;
          continue;
        }

        if (parsedUrl.host === targetHost) {
          const pathname = parsedUrl.pathname;
          if (pathname !== '/') {
            if (!pathname.endsWith('/')) {
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
    } catch (_err) {
      hasErrors = true;
      totalFailures++;
      continue;
    }

    function validateJsonLdValue(value) {
      if (typeof value !== 'string') return;
      let parsedUrl;
      try {
        parsedUrl = new URL(value);
      } catch (_e) {
        return;
      }

      if (parsedUrl.host !== targetHost) return;
      const pathname = parsedUrl.pathname;
      const hasFileExtension = /\.(webp|png|jpg|jpeg|svg|gif|ico|xml|pdf|json|css|js)$/i.test(
        pathname
      );
      if (hasFileExtension) return;

      if (pathname.length > 1 && pathname !== '/') {
        if (!pathname.endsWith('/')) {
          hasErrors = true;
          totalFailures++;
        }
      }
    }

    function traverse(obj) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach((item) => traverse(item));
        return;
      }
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (key === '@id' || key === 'url') {
          validateJsonLdValue(val);
        }
        traverse(val);
      }
    }

    traverse(json);
  }

  return { ok: !hasErrors, failures: totalFailures };
}

export function checkCanonicalSlash(distDir) {
  const dir = distDir || resolveDistDir();
  if (!fs.existsSync(dir)) {
    return {
      ok: false,
      error: `Build output directory "${dir}" does not exist.`,
      failures: 0,
      htmlFilesCount: 0,
    };
  }

  const htmlFiles = getHtmlFiles(dir);
  let totalFailures = 0;
  let hasErrors = false;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const res = validateCanonicalHtml(content, TARGET_HOST);
    if (!res.ok) {
      hasErrors = true;
      totalFailures += res.failures;
    }
  }

  return { ok: !hasErrors, failures: totalFailures, htmlFilesCount: htmlFiles.length };
}

export function main() {
  console.log('==================================================');
  console.log('    SEO CANONICAL TRAILING-SLASH INTEGRITY CHECK  ');
  console.log('==================================================\n');

  const res = checkCanonicalSlash();
  if (!res.ok) {
    if (res.error) {
      console.error(`❌ Error: ${res.error}`);
    } else {
      console.error(`\n❌ SEO canonical check FAILED with ${res.failures} errors.`);
    }
    process.exit(1);
  } else {
    console.log(`ℹ️ Scanned ${res.htmlFilesCount} HTML files from dist/`);
    console.log('\n🎉 SEO canonical check PASSED successfully!');
    process.exit(0);
  }
}

if (isMainModule(import.meta)) {
  parseScriptArgs();
  main();
}
