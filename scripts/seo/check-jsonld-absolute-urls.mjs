import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Recursively walks directory to find all .html files
function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function main() {
  console.log('==================================================');
  console.log('        JSON-LD ABSOLUTE URL INTEGRITY CHECKER    ');
  console.log('==================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ Error: Build output directory "${DIST_DIR}" does not exist.`);
    console.error('Please run "npm run build" before running the JSON-LD check.\n');
    process.exit(1);
  }

  const htmlFiles = getHtmlFiles(DIST_DIR);
  console.log(`ℹ️ Scanned ${htmlFiles.length} HTML files from dist/`);

  let totalScriptsChecked = 0;
  let totalFailures = 0;
  let hasErrors = false;

  const scriptRegex =
    /<script\s+[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;

  for (const file of htmlFiles) {
    const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');

    // Find all matching scripts
    const matches = [...content.matchAll(scriptRegex)];

    for (const match of matches) {
      totalScriptsChecked++;
      const scriptContent = match[1].trim();

      let json;
      try {
        json = JSON.parse(scriptContent);
      } catch (err) {
        console.error(`❌ FAIL: Invalid JSON-LD syntax in "${relPath}"`);
        console.error(`   - Error: ${err.message}`);
        hasErrors = true;
        continue;
      }

      const fileFailures = [];

      function validateValue(value, currentPath) {
        if (typeof value !== 'string') return;

        // Primary rules:
        // a) Cannot start with "/"
        // b) Must be a valid absolute http/https URL
        let isValid = false;

        if (!value.startsWith('/')) {
          try {
            const parsedUrl = new URL(value);
            if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
              isValid = true;
            }
          } catch (e) {
            // Not a valid absolute http/https URL
          }
        }

        if (!isValid) {
          fileFailures.push({
            path: currentPath,
            value: value,
          });
        }
      }

      function traverse(obj, currentPath = '') {
        if (!obj || typeof obj !== 'object') return;

        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            traverse(item, `${currentPath}[${index}]`);
          });
          return;
        }

        for (const key of Object.keys(obj)) {
          const keyPath = currentPath ? `${currentPath}.${key}` : key;
          const val = obj[key];

          if (key === '@id' || key === 'url') {
            validateValue(val, keyPath);
          }

          traverse(val, keyPath);
        }
      }

      traverse(json);

      if (fileFailures.length > 0) {
        console.error(`❌ FAIL: Non-absolute @id or url found in "${relPath}":`);
        for (const failure of fileFailures) {
          console.error(`   - Key path: "${failure.path}"`);
          console.error(`     Value:    "${failure.value}"`);
          totalFailures++;
        }
        hasErrors = true;
      }
    }
  }

  console.log('\n--- Check Summary ---');
  console.log(`ℹ️ Total HTML files scanned: ${htmlFiles.length}`);
  console.log(`ℹ️ Total JSON-LD script blocks parsed: ${totalScriptsChecked}`);

  if (hasErrors) {
    console.error(`\n❌ JSON-LD validation FAILED with ${totalFailures} schema URL errors.`);
    console.log('==================================================\n');
    process.exit(1);
  } else {
    console.log('\n🎉 JSON-LD absolute URL integrity check PASSED successfully!');
    console.log('==================================================\n');
    process.exit(0);
  }
}

main();
