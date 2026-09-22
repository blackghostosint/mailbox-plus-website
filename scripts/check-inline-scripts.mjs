import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveDistDir } from './lib/dist-path.mjs';

export function getHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }
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

export function findInlineScripts(content) {
  const violations = [];
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script\b[^>]*>/gi;
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
      violations.push({ attributes, scriptBody, snippet: scriptBody.slice(0, 80) });
    }
  }

  return violations;
}

export function checkInlineScripts(targetDir) {
  let distDir;
  try {
    distDir = targetDir || resolveDistDir();
  } catch (err) {
    distDir = targetDir;
  }

  if (!distDir || !fs.existsSync(distDir)) {
    return {
      success: false,
      totalInlineScripts: 0,
      violations: [],
      htmlFiles: [],
      error: `Directory not found: ${distDir}`,
    };
  }

  const htmlFiles = getHtmlFiles(distDir);
  let totalInlineScripts = 0;
  const violations = [];

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const fileViolations = findInlineScripts(content);

    for (const v of fileViolations) {
      totalInlineScripts++;
      const relPath = path.relative(distDir, file);
      violations.push({
        file: relPath,
        attributes: v.attributes,
        snippet: v.snippet,
        scriptBody: v.scriptBody,
      });
    }
  }

  return {
    success: totalInlineScripts === 0,
    totalInlineScripts,
    violations,
    htmlFiles,
  };
}

const currentFilePath = fileURLToPath(import.meta.url);
if (
  import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath)
) {
  const result = checkInlineScripts();

  if (!result.success) {
    if (result.violations.length > 0) {
      console.log(
        `[check-inline-scripts] Scanned ${result.htmlFiles.length} HTML file(s) in dist/.`
      );
      console.error(`❌ Found ${result.totalInlineScripts} executable inline script(s) in dist/:`);
      for (const v of result.violations) {
        console.error(` - File: ${v.file}`);
        console.error(`   Snippet: ${v.snippet.replace(/\n/g, ' ')}...`);
      }
    }
    process.exit(1);
  } else {
    console.log(`[check-inline-scripts] Scanned ${result.htmlFiles.length} HTML file(s) in dist/.`);
    console.log(
      `✅ 0 executable inline scripts found across ${result.htmlFiles.length} HTML files.`
    );
  }
}
