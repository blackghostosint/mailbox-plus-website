import fs from 'node:fs';
import path from 'node:path';
import { resolveDistDir } from './lib/dist-path.mjs';

function getHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function checkInlineScripts() {
  const distDir = resolveDistDir();
  if (!fs.existsSync(distDir)) {
    process.exit(1);
  }

  const htmlFiles = getHtmlFiles(distDir);
  let totalInlineScripts = 0;
  const violations = [];

  // Match <script ...> contents </script> or self-closing <script ... />
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = scriptRegex.exec(content)) !== null) {
      const attributes = match[1];
      const scriptBody = match[2].trim();

      // Check if tag has src attribute
      const hasSrc = /\bsrc\s*=\s*/i.test(attributes);

      // Check type attribute
      const typeMatch = attributes.match(/\btype\s*=\s*["']?([^"'\s>]+)["']?/i);
      const scriptType = typeMatch ? typeMatch[1].toLowerCase() : '';

      // JSON-LD or non-executable types are safe
      const isJsonLd = scriptType === 'application/ld+json';
      const isNonExecutable =
        scriptType && scriptType !== 'module' && scriptType !== 'text/javascript' && !isJsonLd;

      // If it has no src and is not application/ld+json / non-executable type, it's an executable inline script
      if (!hasSrc && !isJsonLd && !isNonExecutable && scriptBody.length > 0) {
        totalInlineScripts++;
        const relPath = path.relative(distDir, file);
        violations.push({ file: relPath, attributes, snippet: scriptBody.slice(0, 80) });
      }
    }
  }

  console.log(`[check-inline-scripts] Scanned ${htmlFiles.length} HTML file(s) in dist/.`);

  if (totalInlineScripts > 0) {
    console.error(`❌ Found ${totalInlineScripts} executable inline script(s) in dist/:`);
    for (const v of violations) {
      console.error(` - File: ${v.file}`);
      console.error(`   Snippet: ${v.snippet.replace(/\n/g, ' ')}...`);
    }
    process.exit(1);
  } else {
    console.log(`✅ 0 executable inline scripts found across ${htmlFiles.length} HTML files.`);
  }
}

checkInlineScripts();
