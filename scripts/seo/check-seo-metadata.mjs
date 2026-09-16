import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function main() {
  console.log('==================================================');
  console.log('      SEO METADATA & SCHEMA VERIFICATION CHECK    ');
  console.log('==================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Error: Build output directory "${DIST_DIR}" does not exist.`);
    process.exit(1);
  }

  // Sample pages that MUST have og:image custom tags
  const ogImageChecks = [
    { route: 'amazon-returns', expectedOgImage: '/og/amazon-returns.png' },
    {
      route: 'post-office-alternative-concord-township',
      expectedOgImage: '/og/post-office-alternative-concord-township.png',
    },
    {
      route: 'shipping-center-concord-township',
      expectedOgImage: '/og/shipping-center-concord-township.png',
    },
    {
      route: 'ups-store-alternative-concord-township',
      expectedOgImage: '/og/ups-store-alternative-concord-township.png',
    },
    {
      route: 'virtual-mailbox-concord-township',
      expectedOgImage: '/og/virtual-mailbox-concord-township.png',
    },
  ];

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

  // Sample pages that MUST have ImageObject JSON-LD schema
  const imageObjectSchemaChecks = [
    'dhl-drop-off-chardon',
    'dhl-drop-off-eastlake',
    'fedex-drop-off-chardon',
    'ups-drop-off-chardon',
    'happy-returns-chardon',
  ];

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
