import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveDistDir, getHtmlFiles } from '../lib/dist-path.mjs';

export function validateJsonLdContent(content) {
  let totalScriptsChecked = 0;
  let totalFailures = 0;
  let hasErrors = false;

  const scriptRegex =
    /<script\s+[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\b[^>]*>/gi;

  const matches = [...content.matchAll(scriptRegex)];

  for (const match of matches) {
    totalScriptsChecked++;
    const scriptContent = match[1].trim();

    let json;
    try {
      json = JSON.parse(scriptContent);
    } catch (_err) {
      hasErrors = true;
      totalFailures++;
      continue;
    }

    function validateValue(value) {
      if (typeof value !== 'string') return;
      let isValid = false;
      if (!value.startsWith('/')) {
        try {
          const parsedUrl = new URL(value);
          if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
            isValid = true;
          }
        } catch (_e) {
          // Invalid URL string
        }
      }
      if (!isValid) {
        hasErrors = true;
        totalFailures++;
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
        if (key === '@id' || key === 'url' || key === 'contentUrl') {
          validateValue(val);
        }
        traverse(val);
      }
    }

    traverse(json);
  }

  return {
    ok: !hasErrors,
    failures: totalFailures,
    scriptsChecked: totalScriptsChecked,
  };
}

export function checkJsonLdAbsoluteUrls(distDir) {
  const dir = distDir || resolveDistDir();
  if (!fs.existsSync(dir)) {
    return {
      ok: false,
      error: `Build output directory "${dir}" does not exist.`,
      failures: 0,
      scriptsChecked: 0,
      htmlFilesCount: 0,
    };
  }

  const htmlFiles = getHtmlFiles(dir);
  let totalScriptsChecked = 0;
  let totalFailures = 0;
  let hasErrors = false;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const res = validateJsonLdContent(content);
    totalScriptsChecked += res.scriptsChecked;
    if (!res.ok) {
      hasErrors = true;
      totalFailures += res.failures;
    }
  }

  return {
    ok: !hasErrors,
    failures: totalFailures,
    scriptsChecked: totalScriptsChecked,
    htmlFilesCount: htmlFiles.length,
  };
}

export function main() {
  console.log('==================================================');
  console.log('        JSON-LD ABSOLUTE URL INTEGRITY CHECKER    ');
  console.log('==================================================\n');

  const res = checkJsonLdAbsoluteUrls();
  if (!res.ok) {
    if (res.error) {
      console.error(`❌ Error: ${res.error}`);
    } else {
      console.error(`\n❌ JSON-LD validation FAILED with ${res.failures} schema URL errors.`);
    }
    process.exit(1);
  } else {
    console.log(`ℹ️ Scanned ${res.htmlFilesCount} HTML files from dist/`);
    console.log(`ℹ️ Total JSON-LD script blocks parsed: ${res.scriptsChecked}`);
    console.log('\n🎉 JSON-LD absolute URL integrity check PASSED successfully!');
    process.exit(0);
  }
}

const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  main();
}
