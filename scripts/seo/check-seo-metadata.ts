import fs from 'node:fs';
import path from 'node:path';
import { resolveDistDir } from '../lib/dist-path.mjs';

if (!process.env.VITE_R2_PUBLIC_BASE_URL) {
  process.env.VITE_R2_PUBLIC_BASE_URL = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev';
}

const { services } = await import('../../astro/src/config/services.ts');

const DIST_DIR = resolveDistDir();

interface OgImageCheck {
  route: string;
  expectedOgImage: string;
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

function main() {
  console.log('==================================================');
  console.log('      SEO METADATA & SCHEMA VERIFICATION CHECK    ');
  console.log('==================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Error: Build output directory "${DIST_DIR}" does not exist.`);
    process.exit(1);
  }

  const { ogImageChecks, imageObjectSchemaChecks } = discoverServiceMetadata();
  console.log(
    `Discovered ${ogImageChecks.length} og:image route requirement(s) from service configs.`
  );
  console.log(
    `Discovered ${imageObjectSchemaChecks.length} ImageObject schema route requirement(s) from service configs.\n`
  );

  let errors = 0;

  for (const item of ogImageChecks) {
    const htmlFile = path.join(DIST_DIR, item.route, 'index.html');
    if (!fs.existsSync(htmlFile)) {
      console.error(
        `❌ FAIL: Expected build output page "${item.route}/index.html" does not exist.`
      );
      errors++;
      continue;
    }

    const html = fs.readFileSync(htmlFile, 'utf8');
    const ogImageMetaPattern = new RegExp(
      `<meta\\s+property=["']og:image["']\\s+content=["'][^"']*${item.expectedOgImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`,
      'i'
    );

    if (!ogImageMetaPattern.test(html)) {
      console.error(
        `❌ FAIL: "${item.route}" HTML does not contain expected og:image meta tag matching "${item.expectedOgImage}"`
      );
      errors++;
    } else {
      console.log(`✅ PASS: "${item.route}" contains correct og:image meta tag.`);
    }
  }

  for (const route of imageObjectSchemaChecks) {
    const htmlFile = path.join(DIST_DIR, route, 'index.html');
    if (!fs.existsSync(htmlFile)) {
      console.error(`❌ FAIL: Expected build output page "${route}/index.html" does not exist.`);
      errors++;
      continue;
    }

    const html = fs.readFileSync(htmlFile, 'utf8');
    if (!html.includes('"@type":"ImageObject"') && !html.includes('"@type": "ImageObject"')) {
      console.error(`❌ FAIL: "${route}" HTML does not contain ImageObject JSON-LD schema block.`);
      errors++;
    } else {
      console.log(`✅ PASS: "${route}" contains ImageObject JSON-LD schema.`);
    }
  }

  if (errors > 0) {
    console.error(`\n❌ SEO metadata verification FAILED with ${errors} error(s).\n`);
    process.exit(1);
  } else {
    console.log('\n🎉 SEO metadata verification PASSED successfully!\n');
    process.exit(0);
  }
}

main();
