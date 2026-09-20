#!/usr/bin/env tsx
/**
 * API Specification Generator
 * Inspects JSDoc comments and export metadata in netlify/functions/*.ts
 * and outputs an updated OpenAPI 3.0 specification file at docs/openapi.json.
 *
 * Usage:
 *   npx tsx scripts/generate-api-spec.ts [--write] [--check]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const FUNCTIONS_DIR = path.join(ROOT, 'netlify', 'functions');
const OPENAPI_PATH = path.join(ROOT, 'docs', 'openapi.json');

// Helper simple YAML parser for @openapi JSDoc blocks
function parseYamlBlock(yamlText: string): any {
  const lines = yamlText
    .split('\n')
    .map((l) => l.replace(/[\r\n]/g, ''))
    .filter((l) => l.trim().length > 0 && !l.trim().startsWith('#'));

  let index = 0;

  function getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  function parseValue(valStr: string): any {
    const v = valStr.trim();
    if (!v) return null;
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (/^-?\d+$/.test(v)) return parseInt(v, 10);
    if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
      return v.slice(1, -1);
    }
    return v;
  }

  function parseNode(currentIndent: number): any {
    let resultObj: Record<string, any> | null = null;
    let resultArr: any[] | null = null;

    while (index < lines.length) {
      const line = lines[index];
      const indent = getIndent(line);

      if (indent < currentIndent) {
        break;
      }

      const trimmed = line.trim();

      // Check if array item
      if (trimmed.startsWith('- ')) {
        if (!resultArr) resultArr = [];
        const itemContent = trimmed.slice(2).trim();

        if (itemContent.includes(':')) {
          // Object item in array
          lines[index] = ' '.repeat(indent + 2) + itemContent;
          const childObj = parseNode(indent + 2);
          resultArr.push(childObj);
        } else {
          // Scalar item in array
          resultArr.push(parseValue(itemContent));
          index++;
        }
        continue;
      }

      // Key-value pair
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        if (!resultObj) resultObj = {};
        const keyRaw = trimmed.slice(0, colonIdx).trim();
        const key =
          (keyRaw.startsWith("'") && keyRaw.endsWith("'")) ||
          (keyRaw.startsWith('"') && keyRaw.endsWith('"'))
            ? keyRaw.slice(1, -1)
            : keyRaw;
        const valRest = trimmed.slice(colonIdx + 1).trim();

        index++;

        if (valRest.length > 0) {
          resultObj[key] = parseValue(valRest);
        } else {
          // Child block
          if (index < lines.length) {
            const nextIndent = getIndent(lines[index]);
            if (nextIndent > indent) {
              resultObj[key] = parseNode(nextIndent);
            } else {
              resultObj[key] = null;
            }
          } else {
            resultObj[key] = null;
          }
        }
        continue;
      }

      index++;
    }

    return resultArr !== null ? resultArr : resultObj || {};
  }

  return parseNode(0);
}

export function extractOpenApiSpecsFromFunctions(
  dirPath: string = FUNCTIONS_DIR
): Record<string, any> {
  const pathsObj: Record<string, any> = {};

  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Netlify functions directory missing at ${dirPath}`);
    return pathsObj;
  }

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (!file.endsWith('.ts') || file.endsWith('.test.ts')) continue;
    const fullPath = path.join(dirPath, file);
    if (!fs.statSync(fullPath).isFile()) continue;

    const content = fs.readFileSync(fullPath, 'utf8');

    // Extract @openapi JSDoc blocks
    const openapiBlockRegex = /\/\*\*[\s\S]*?@openapi([\s\S]*?)\*\//g;
    let match: RegExpExecArray | null;

    while ((match = openapiBlockRegex.exec(content)) !== null) {
      const rawBlock = match[1];
      // Clean leading asterisk from comment lines
      const yamlLines = rawBlock
        .split('\n')
        .map((line) => line.replace(/^\s*\*\s?/, ''))
        .join('\n');

      const parsed = parseYamlBlock(yamlLines);
      if (parsed && typeof parsed === 'object') {
        for (const [routePath, methods] of Object.entries(parsed)) {
          if (!pathsObj[routePath]) {
            pathsObj[routePath] = {};
          }
          Object.assign(pathsObj[routePath], methods);
        }
      }
    }
  }

  return pathsObj;
}

export function buildOpenApiSpec(): any {
  const extractedPaths = extractOpenApiSpecsFromFunctions();

  // Sort paths alphabetically
  const sortedPaths: Record<string, any> = {};
  const pathKeys = Object.keys(extractedPaths).sort();
  for (const k of pathKeys) {
    sortedPaths[k] = extractedPaths[k];
  }

  return {
    openapi: '3.0.3',
    info: {
      title: 'Mailbox Plus Serverless API',
      version: '1.0.0',
      description: 'OpenAPI 3.0 specification for Mailbox Plus Netlify serverless functions',
    },
    servers: [
      {
        url: 'https://mailboxplusohio.com',
        description: 'Production server',
      },
    ],
    paths: sortedPaths,
  };
}

export function printDiffSummary(filename: string, existing: string, expected: string): void {
  const existingLines = existing.split('\n');
  const expectedLines = expected.split('\n');

  console.error(`\n--- Diff Summary for ${filename} ---`);
  console.error(`  On-disk line count:  ${existingLines.length}`);
  console.error(`  Expected line count: ${expectedLines.length}`);

  let diffCount = 0;
  const maxDiffs = 10;
  const maxLines = Math.max(existingLines.length, expectedLines.length);

  for (let i = 0; i < maxLines; i++) {
    const actualLine = existingLines[i];
    const expectedLine = expectedLines[i];
    if (actualLine !== expectedLine) {
      diffCount++;
      if (diffCount <= maxDiffs) {
        console.error(`  Difference at line ${i + 1}:`);
        console.error(
          `    - Disk:     ${actualLine !== undefined ? JSON.stringify(actualLine) : '<EOF>'}`
        );
        console.error(
          `    + Expected: ${expectedLine !== undefined ? JSON.stringify(expectedLine) : '<EOF>'}`
        );
      }
    }
  }

  if (diffCount > maxDiffs) {
    console.error(`  ... and ${diffCount - maxDiffs} more differing lines.`);
  }
  console.error(`--------------------------------------\n`);
}

export async function runGenerateApiSpec(options?: {
  write?: boolean;
  check?: boolean;
}): Promise<boolean> {
  const write = options?.write ?? true;
  const check = options?.check ?? false;

  console.log('⚙️ Generating OpenAPI 3.0 specification from Netlify functions...');

  const spec = buildOpenApiSpec();
  const requiredEndpoints = [
    '/.netlify/functions/create-checkout',
    '/.netlify/functions/csp-report',
    '/.netlify/functions/health',
    '/api/reviews',
    '/.netlify/functions/sendEmail',
    '/.netlify/functions/verify-session',
  ];

  const generatedPaths = Object.keys(spec.paths || {});
  const missingEndpoints = requiredEndpoints.filter((ep) => !generatedPaths.includes(ep));

  if (missingEndpoints.length > 0) {
    console.error(
      `❌ Missing OpenAPI definitions for required endpoints: ${missingEndpoints.join(', ')}`
    );
    return false;
  }

  const rawJson = JSON.stringify(spec, null, 2);
  const expectedJson = await prettier.format(rawJson, { parser: 'json' });
  const existingJson = fs.existsSync(OPENAPI_PATH) ? fs.readFileSync(OPENAPI_PATH, 'utf8') : '';

  if (check) {
    if (!fs.existsSync(OPENAPI_PATH)) {
      console.error(`❌ docs/openapi.json does not exist on disk.`);
      return false;
    }
    if (existingJson !== expectedJson) {
      console.error(`❌ Drift detected in docs/openapi.json!`);
      printDiffSummary('docs/openapi.json', existingJson, expectedJson);
      console.error(
        `Run "npm run generate:api-spec" or "npx tsx scripts/generate-api-spec.ts --write" to update docs/openapi.json.`
      );
      return false;
    }
    console.log(
      `✅ docs/openapi.json is up-to-date and synchronized with Netlify function JSDoc metadata.`
    );
    return true;
  }

  if (write) {
    fs.mkdirSync(path.dirname(OPENAPI_PATH), { recursive: true });
    fs.writeFileSync(OPENAPI_PATH, expectedJson, 'utf8');
    console.log(
      `✅ Successfully wrote updated OpenAPI 3.0 specification covering ${generatedPaths.length} endpoints to docs/openapi.json.`
    );
  }
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  const write = process.argv.includes('--write') || !check;
  runGenerateApiSpec({ write, check }).then((success) => {
    process.exit(success ? 0 : 1);
  });
}
