#!/usr/bin/env node
/**
 * Script to extract FAQ data from TypeScript config files using ts-node.
 * Run with: npx tsx scripts/extract-faqs.ts
 */

import { register } from 'ts-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Register ts-node to handle TypeScript imports
register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'ES2020',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    strict: true,
  },
});

const FAQS_SRC = path.join(PROJECT_ROOT, 'src/config/faqs');
const FAQS_DST = path.join(PROJECT_ROOT, 'public/data/faqs');

// Ensure output directory exists
if (!fs.existsSync(FAQS_DST)) {
  fs.mkdirSync(FAQS_DST, { recursive: true });
}

async function extractFAQs() {
  const categories = fs
    .readdirSync(FAQS_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  console.log('Processing FAQ categories:', categories);

  let totalFAQs = 0;
  const manifest: Record<string, string[]> = {};

  for (const category of categories) {
    const categorySrc = path.join(FAQS_SRC, category);
    const categoryDst = path.join(FAQS_DST, category);

    if (!fs.existsSync(categoryDst)) {
      fs.mkdirSync(categoryDst, { recursive: true });
    }

    // Import the category index which re-exports all FAQ arrays
    try {
      const categoryModule = await import(path.join(categorySrc, 'index.ts'));
      const categoryFiles = fs
        .readdirSync(path.join(FAQS_SRC, category))
        .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

      const categoryManifest: string[] = [];

      for (const file of categoryFiles) {
        const filePath = path.join(categorySrc, file);
        const fileModule = await import(filePath);

        for (const [key, value] of Object.entries(fileModule)) {
          if (key === 'default' || key === '__esModule') continue;
          if (Array.isArray(value) && value.length > 0 && value[0]?.question) {
            const fileName = file.replace('.ts', '');
            const outPath = path.join(categoryDst, `${fileName}.json`);
            fs.writeFileSync(outPath, JSON.stringify(value, null, 2));
            console.log(`  ${category}/${fileName}.json: ${value.length} FAQs`);
            categoryManifest.push(fileName);
          }
        }
      }

      if (categoryManifest.length > 0) {
        manifest[category] = categoryManifest;
      }
    } catch (e) {
      console.warn(`Failed to import category ${category}:`, e);
    }
  }

  // Write manifest
  fs.writeFileSync(path.join(FAQS_DST, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`\nManifest written to public/data/faqs/manifest.json`);
  console.log(`Categories: ${Object.keys(manifest).join(', ')}`);
}

extractFAQs().catch(console.error);
