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

export function checkSeoMetadata(distDir = DIST_DIR) {
  if (!fs.existsSync(distDir)) {
    return { ok: false, error: `Build output directory "${distDir}" does not exist.`, errors: 0 };
  }

  const { ogImageChecks, imageObjectSchemaChecks } = discoverServiceMetadata();
  let errors = 0;

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

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isMain) {
  main();
}
