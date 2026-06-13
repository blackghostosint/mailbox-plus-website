#!/usr/bin/env node
/**
 * Extract FAQ data using a simple regex-based approach that handles TS syntax.
 * Run with: node scripts/extract-faqs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const FAQS_SRC = path.join(PROJECT_ROOT, 'src/config/faqs');
const FAQS_DST = path.join(PROJECT_ROOT, 'public/data/faqs');

// Ensure output directory exists
if (!fs.existsSync(FAQS_DST)) {
  fs.mkdirSync(FAQS_DST, { recursive: true });
}

// Read and parse a TypeScript FAQ file
function parseFAQFile(content: string): Record<string, any[]> {
  const result: Record<string, any[]> = {};

  // Find all export const X: FAQ[] = [ ... ];
  // This regex finds the array content between [ and the matching ]
  const exportRegex = /export\s+const\s+(\w+)\s*:\s*FAQ\[\]\s*=\s*(\[[\s\S]*?^\s*\]);/gm;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    const arrayName = match[1];
    const arrayContent = match[2];

    try {
      // Convert TypeScript array to valid JSON
      // Step 1: Handle smart quotes - replace ’ with '
      let jsonStr = arrayContent.replace(/[\u2018\u2019]/g, "'");

      // Step 2: Remove trailing commas
      jsonStr = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

      // Step 3: Handle unquoted property names
      jsonStr = jsonStr.replace(/(\w+):\s*/g, '"$1": ');

      // Step 4: Handle smart quotes in string values
      jsonStr = jsonStr.replace(/:\s*'([^']*)

'/, ': "$1"');

      // Step 5: Fix template literal content that might have newlines
      // This is a simplification - template literals with expressions will fail
      // But FAQ data typically doesn't use template expressions

      // Parse as JSON
      const parsed = JSON.parse(jsonStr);
      result[arrayName] = parsed;
    } catch (e) {
      console.warn(`  ⚠️  Failed to parse array in file: ${arrayName}`);
      // Try a more aggressive cleanup
      try {
        let jsonStr = arrayContent
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201c\u201d]/g, '"')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/(\w+):\s*/g, '"$1": ');

        // Handle template literals by replacing ${...} with empty string
        jsonStr = jsonStr.replace(/\$\{[^}]*\}/g, '""');

        const parsed = JSON.parse(jsonStr);
        result[arrayName] = parsed;
      } catch (e2) {
        console.warn(`  ⚠️  Still failed to parse ${arrayName}:`, e2);
      }
    }
  }

  return result;
}

// Main extraction
async function extractFAQs() {
  const PROJECT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const FAQS_SRC = path.join(PROJECT_ROOT, 'src/config/faqs');
  const FAQS_DST = path.join(PROJECT_ROOT, 'public/data/faqs');

  if (!fs.existsSync(FAQS_DST)) {
    fs.mkdirSync(FAQS_DST, { recursive: true });
  }

  const categories = fs.readdirSync(FAQS_SRC, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  console.log('Processing FAQ categories:', categories);

  let totalFAQs = 0;
  const manifest: Record<string, string[]> = {};

  for (const category of categories) {
    const categorySrc = path.join(FAQS_SRC, category);
    const categoryDst = path.join(FAQS_DST, category);

    if (!fs.existsSync(categoryDst)) {
      fs.mkdirSync(categoryDst, { recursive: true });
    }

    const files = fs.readdirSync(categorySrc)
      .filter(f => f.endsWith('.ts') && f !== 'index.ts');

    const categoryManifest: string[] = [];

    for (const file of files) {
      const filePath = path.join(categorySrc, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parseFAQFile(content);

      for (const [arrayName, faqs] of Object.entries(parsed)) {
        if (faqs.length > 0) {
          const fileName = file.replace('.ts', '');
          const outPath = path.join(categoryDst, `${fileName}.json`);
          fs.writeFileSync(outPath, JSON.stringify(faqs, null, 2));
          console.log(`  ${category}/${fileName}.json: ${faqs.length} FAQs`);
          categoryManifest.push(`${fileName}.json`);
          totalFAQs += faqs.length;
        }
      }
    }

    if (categoryManifest.length > 0) {
      manifest[category] = categoryManifest;
    }
  }

  // Write manifest
  fs.writeFileSync(
    path.join(FAQS_DST, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\n✅ Total FAQs extracted: ${totalFAQs}`);
  console.log(`📄 Manifest written to public/data/faqs/manifest.json`);
}

// Run
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

extractFAQs().catch(console.error);