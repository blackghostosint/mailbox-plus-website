import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SERVICES_DIR = path.join(ROOT_DIR, 'astro', 'src', 'config', 'services');

function walkDir(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  fs.readdirSync(dir).forEach((f) => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files = files.concat(walkDir(full));
    else if (f.endsWith('.ts')) files.push(full);
  });
  return files;
}

function discoverServiceMetadata() {
  const tsFiles = walkDir(SERVICES_DIR);
  const ogImageChecks = [];
  const imageObjectSchemaChecks = [];

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const objectBlocks = content.split(/\{\s*id:/);

    for (const block of objectBlocks) {
      const slugMatch = block.match(/slug:\s*['"`]([^'"`]+)['"`]/);
      const ogMatch = block.match(/ogImage:\s*['"`]([^'"`]+)['"`]/);

      if (slugMatch && ogMatch) {
        const route = slugMatch[1].replace(/^\//, '').replace(/\/$/, '');
        const expectedOgImage = ogMatch[1];
        if (route && expectedOgImage && !ogImageChecks.some((c) => c.route === route)) {
          ogImageChecks.push({ route, expectedOgImage });
        }
      }

      if (
        block.includes('headJsonLd') ||
        block.includes('getImageObjectSchema') ||
        block.includes('ImageObject')
      ) {
        if (slugMatch) {
          const route = slugMatch[1].replace(/^\//, '').replace(/\/$/, '');
          if (route && !imageObjectSchemaChecks.includes(route)) {
            imageObjectSchemaChecks.push(route);
          }
        }
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
      `<meta\\s+property=["']og:image["']\\s+content=["'][^"']*${item.expectedOgImage}["']`,
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
