import fs from 'node:fs';
import path from 'node:path';
import { resolveDistDir } from '../lib/dist-path.mjs';
import { isMainModule, parseScriptArgs } from '../lib/cli-utils.ts';

if (!process.env.VITE_R2_PUBLIC_BASE_URL) {
  process.env.VITE_R2_PUBLIC_BASE_URL = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev';
}

const { services } = await import('../../astro/src/config/services.ts');
const { getPageMeta } = await import('../../astro/src/config/pageMeta.ts');

const DIST_DIR = resolveDistDir();

interface OgImageCheck {
  route: string;
  expectedOgImage: string;
}

interface StaticPageInfo {
  relPath: string;
  routePath: string;
  filePath: string;
}

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
};

export function decodeHtml(html: string): string {
  return html.replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, (match) => HTML_ENTITIES[match] ?? match);
}

function discoverServiceMetadata() {
  const ogImageChecks: OgImageCheck[] = [];
  const imageObjectSchemaChecks: string[] = [];

  for (const service of services) {
    if (!service || !service.slug) continue;
    const route = service.slug.replace(/^\//, '').replace(/\/$/, '');
    if (!route) continue;

    if (service.ogImage) {
      if (!ogImageChecks.some((c) => c.route === route)) {
        ogImageChecks.push({ route, expectedOgImage: service.ogImage });
      }
    }

    if (service.headJsonLd) {
      const headJsonLd = service.headJsonLd;
      const hasImageObject = Array.isArray(headJsonLd)
        ? headJsonLd.some(
            (s) =>
              s &&
              typeof s === 'object' &&
              (s as Record<string, unknown>)['@type'] === 'ImageObject'
          )
        : headJsonLd &&
          typeof headJsonLd === 'object' &&
          (headJsonLd as Record<string, unknown>)['@type'] === 'ImageObject';

      if (hasImageObject && !imageObjectSchemaChecks.includes(route)) {
        imageObjectSchemaChecks.push(route);
      }
    }
  }

  return { ogImageChecks, imageObjectSchemaChecks };
}

function discoverStaticPageRoutes(): StaticPageInfo[] {
  const pagesDir = path.resolve(process.cwd(), 'astro/src/pages');
  const results: StaticPageInfo[] = [];

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith('.astro')) {
        const relPath = path.relative(pagesDir, fullPath);
        if (relPath.includes('[slug]') || relPath.includes('[...')) {
          continue;
        }
        let route = '/' + relPath.replace(/\.astro$/, '').replace(/\/index$/, '');
        if (route === '/index') route = '/';
        if (route.length > 1 && !route.endsWith('/')) route += '/';
        results.push({ relPath, routePath: route, filePath: fullPath });
      }
    }
  }

  if (fs.existsSync(pagesDir)) {
    scan(pagesDir);
  }
  return results;
}

function resolveHtmlPath(distDir: string, relPath: string): string {
  const relClean = relPath.replace(/\.astro$/, '');
  if (relClean === 'index') {
    return path.join(distDir, 'index.html');
  }
  if (relClean === '404') {
    const path404Direct = path.join(distDir, '404.html');
    if (fs.existsSync(path404Direct)) return path404Direct;
    return path.join(distDir, '404', 'index.html');
  }
  if (relClean.endsWith('/index')) {
    return path.join(distDir, relClean.replace(/\/index$/, ''), 'index.html');
  }
  const folderHtml = path.join(distDir, relClean, 'index.html');
  if (fs.existsSync(folderHtml)) return folderHtml;
  return path.join(distDir, `${relClean}.html`);
}

export function checkSeoMetadata(distDir = DIST_DIR) {
  if (!fs.existsSync(distDir)) {
    return { ok: false, error: `Build output directory "${distDir}" does not exist.`, errors: 0 };
  }

  let errors = 0;

  // 1. Static page route discovery and pageMeta registration verification
  const staticPages = discoverStaticPageRoutes();

  for (const page of staticPages) {
    const pageContent = fs.readFileSync(page.filePath, 'utf8');

    // Check for duplicate inline title/description props on <BaseLayout>
    const layoutMatches = pageContent.match(/<BaseLayout[\s\S]*?>/g);
    if (layoutMatches) {
      for (const layoutTag of layoutMatches) {
        if (layoutTag.includes('title=') || layoutTag.includes('description=')) {
          console.error(
            `❌ FAIL: Static page "${page.relPath}" passes inline title or description prop to <BaseLayout> instead of relying on pageMeta.ts`
          );
          errors++;
        }
      }
    }

    // Confirm entry in pageMeta.ts
    const meta = getPageMeta(page.routePath);
    if (!meta || !meta.title || !meta.description) {
      console.error(
        `❌ FAIL: Static route "${page.routePath}" (${page.relPath}) lacks a complete entry in pageMeta.ts`
      );
      errors++;
      continue;
    }

    // Inspect rendered HTML file in dist/
    const htmlFile = resolveHtmlPath(distDir, page.relPath);
    if (!fs.existsSync(htmlFile)) {
      console.error(
        `❌ FAIL: Expected build output HTML "${htmlFile}" for route "${page.routePath}" does not exist`
      );
      errors++;
      continue;
    }

    const html = fs.readFileSync(htmlFile, 'utf8');

    // Verify <title>
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      console.error(`❌ FAIL: "${page.routePath}" HTML does not contain a valid <title> tag`);
      errors++;
    } else {
      const renderedTitle = decodeHtml(titleMatch[1].trim());
      if (renderedTitle !== meta.title) {
        console.error(
          `❌ FAIL: "${page.routePath}" title mismatch.\n  Expected (pageMeta.ts): "${meta.title}"\n  Rendered (HTML):       "${renderedTitle}"`
        );
        errors++;
      }
    }

    // Verify <meta name="description">
    const descMatch =
      html.match(/<meta\s+name=["']description["']\s+content=(["'])([\s\S]*?)\1/i) ||
      html.match(/<meta\s+content=(["'])([\s\S]*?)\1\s+name=["']description["']/i);

    const extractedDesc = descMatch ? descMatch[2] : undefined;

    if (!extractedDesc || !extractedDesc.trim()) {
      console.error(
        `❌ FAIL: "${page.routePath}" HTML does not contain a valid <meta name="description"> tag`
      );
      errors++;
    } else {
      const renderedDesc = decodeHtml(extractedDesc.trim());
      if (renderedDesc !== meta.description) {
        console.error(
          `❌ FAIL: "${page.routePath}" description mismatch.\n  Expected (pageMeta.ts): "${meta.description}"\n  Rendered (HTML):       "${renderedDesc}"`
        );
        errors++;
      }
    }

    // Verify WebPage JSON-LD schema name & description match pageMeta.ts
    let expectedWpName = meta.title;
    let expectedWpDesc = meta.description;
    if (meta.schema) {
      for (const sNode of meta.schema) {
        if (
          sNode &&
          typeof sNode === 'object' &&
          (sNode as unknown as Record<string, unknown>)['@type'] === 'WebPage'
        ) {
          const sWp = sNode as unknown as Record<string, unknown>;
          if (sWp.name) expectedWpName = String(sWp.name);
          if (sWp.description) expectedWpDesc = String(sWp.description);
        }
      }
    }

    const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    for (const match of html.matchAll(jsonLdRegex)) {
      const rawJson = match[1].trim();
      try {
        const parsed = JSON.parse(rawJson);
        const graph = parsed['@graph'] || (Array.isArray(parsed) ? parsed : [parsed]);
        for (const node of graph) {
          if (node && typeof node === 'object' && node['@type'] === 'WebPage') {
            const wpName = node.name ? decodeHtml(String(node.name).trim()) : undefined;
            const wpDesc = node.description
              ? decodeHtml(String(node.description).trim())
              : undefined;

            if (wpName && wpName !== expectedWpName) {
              console.error(
                `❌ FAIL: "${page.routePath}" WebPage JSON-LD name mismatch.\n  Expected (pageMeta.ts): "${expectedWpName}"\n  WebPage.name (JSON-LD): "${wpName}"`
              );
              errors++;
            }
            if (wpDesc && wpDesc !== expectedWpDesc) {
              console.error(
                `❌ FAIL: "${page.routePath}" WebPage JSON-LD description mismatch.\n  Expected (pageMeta.ts):       "${expectedWpDesc}"\n  WebPage.description (JSON-LD): "${wpDesc}"`
              );
              errors++;
            }
          }
        }
      } catch (_e) {
        console.error(`❌ FAIL: "${page.routePath}" failed to parse JSON-LD script tag`);
        errors++;
      }
    }
  }

  // 2. Service metadata ogImage and ImageObject checks
  const { ogImageChecks, imageObjectSchemaChecks } = discoverServiceMetadata();

  for (const item of ogImageChecks) {
    const htmlFile = path.join(distDir, item.route, 'index.html');
    if (!fs.existsSync(htmlFile)) {
      errors++;
      continue;
    }

    const html = fs.readFileSync(htmlFile, 'utf8');
    const ogImageMetaPattern = new RegExp(
      `<meta\\s+property=["']og:image["']\\s+content=["'][^"']*${item.expectedOgImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`,
      'i'
    );

    if (!ogImageMetaPattern.test(html)) {
      errors++;
    }
  }

  for (const route of imageObjectSchemaChecks) {
    const htmlFile = path.join(distDir, route, 'index.html');
    if (!fs.existsSync(htmlFile)) {
      errors++;
      continue;
    }

    const html = fs.readFileSync(htmlFile, 'utf8');
    if (!html.includes('"@type":"ImageObject"') && !html.includes('"@type": "ImageObject"')) {
      errors++;
    }
  }

  return {
    ok: errors === 0,
    errors,
    ogImageCount: ogImageChecks.length,
    imageObjectCount: imageObjectSchemaChecks.length,
  };
}

export function main() {
  console.log('==================================================');
  console.log('      SEO METADATA & SCHEMA VERIFICATION CHECK    ');
  console.log('==================================================\n');

  const res = checkSeoMetadata();
  if (!res.ok) {
    if (res.error) {
      console.error(`❌ Error: ${res.error}`);
    } else {
      console.error(`\n❌ SEO metadata verification FAILED with ${res.errors} error(s).\n`);
    }
    process.exit(1);
  } else {
    console.log(
      `Discovered ${res.ogImageCount} og:image route requirement(s) from service configs.`
    );
    console.log(
      `Discovered ${res.imageObjectCount} ImageObject schema route requirement(s) from service configs.\n`
    );
    console.log('🎉 SEO metadata verification PASSED successfully!\n');
    process.exit(0);
  }
}

export { discoverServiceMetadata };

if (isMainModule(import.meta)) {
  parseScriptArgs();
  main();
}
