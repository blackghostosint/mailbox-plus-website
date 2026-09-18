import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import ts from 'typescript';
import { resolveDistDir } from '../lib/dist-path.mjs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const DIST_DIR = resolveDistDir();
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

function evaluateServiceFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Strip icon and type imports
  content = content.replace(/import\s+(\w+)\s+from\s+['"].*~icons\/.*['"];?/g, 'const $1 = {};');
  content = content.replace(
    /import\s+.*from\s+['"].*\/schema['"];?/g,
    'function getImageObjectSchema(opts) { return { "@context": "https://schema.org", "@type": "ImageObject", ...opts }; }'
  );
  content = content.replace(/import\s+type\s+.*from\s+['"].*['"];?/g, '');
  content = content.replace(/import\s+.*from\s+['"].*\/lib\/storage['"];?/g, '');

  // Handle named imports (e.g. import { x, y } from './foo')
  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"].*['"];?/g, (m, p1) =>
    p1
      .split(',')
      .map((s) => {
        const name = s.trim().split(/\s+as\s+/)[0];
        return name ? `const ${name} = [];` : '';
      })
      .join('\n')
  );

  // Handle default / wildcard imports from relative paths
  content = content.replace(/import\s+(\w+)\s+from\s+['"]\.\/.*['"];?/g, 'const $1 = [];');

  // Handle re-exports (e.g. export { microProblems } from '../micro-problems')
  content = content.replace(/export\s+\{([^}]+)\}\s+from\s+['"].*['"];?/g, (m, p1) =>
    p1
      .split(',')
      .map((s) => {
        const name = s.trim().split(/\s+as\s+/)[0];
        return name ? `const ${name} = [];\nexport { ${name} };` : '';
      })
      .join('\n')
  );

  // Helper stubs
  if (
    !content.includes('function getServiceImageUrl') &&
    !content.includes('const getServiceImageUrl')
  ) {
    content =
      'const getServiceImageUrl = (p) => "https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev/" + p;\n' +
      content;
  }

  const js = ts.transpileModule(content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;

  const mod = { exports: {} };
  const fn = new Function('exports', 'module', 'require', js);
  fn(mod.exports, mod, require);

  const services = [];
  for (const val of Object.values(mod.exports)) {
    if (Array.isArray(val)) {
      services.push(...val);
    } else if (val && typeof val === 'object' && val.slug) {
      services.push(val);
    }
  }
  return services;
}

function discoverServiceMetadata() {
  const tsFiles = walkDir(SERVICES_DIR);
  const ogImageChecks = [];
  const imageObjectSchemaChecks = [];
  let evalErrors = 0;

  for (const file of tsFiles) {
    if (file.endsWith('index.ts')) continue;
    try {
      const services = evaluateServiceFile(file);
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
          const hasImageObject = Array.isArray(service.headJsonLd)
            ? service.headJsonLd.some((s) => s && s['@type'] === 'ImageObject')
            : service.headJsonLd && service.headJsonLd['@type'] === 'ImageObject';

          if (hasImageObject && !imageObjectSchemaChecks.includes(route)) {
            imageObjectSchemaChecks.push(route);
          }
        }
      }
    } catch (err) {
      console.error(`❌ Error: Failed to evaluate ${file}: ${err.message}`);
      evalErrors++;
    }
  }

  return { ogImageChecks, imageObjectSchemaChecks, evalErrors };
}

function main() {
  console.log('==================================================');
  console.log('      SEO METADATA & SCHEMA VERIFICATION CHECK    ');
  console.log('==================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Error: Build output directory "${DIST_DIR}" does not exist.`);
    process.exit(1);
  }

  const { ogImageChecks, imageObjectSchemaChecks, evalErrors } = discoverServiceMetadata();
  console.log(
    `Discovered ${ogImageChecks.length} og:image route requirement(s) from service configs.`
  );
  console.log(
    `Discovered ${imageObjectSchemaChecks.length} ImageObject schema route requirement(s) from service configs.\n`
  );

  let errors = evalErrors;

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
