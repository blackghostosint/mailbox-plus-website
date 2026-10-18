import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const FORBIDDEN_FONT_CDN_PATTERNS = [
  /fonts\.googleapis\.com/i,
  /fonts\.gstatic\.com/i,
  /use\.typekit\.net/i,
  /https?:\/\/.*?\.(woff2?|ttf|otf|eot)(\?.*)?$/i,
];

export interface FontCdnViolation {
  file: string;
  line: number;
  match: string;
  snippet: string;
}

export interface CheckFontCdnResult {
  success: boolean;
  totalViolations: number;
  violations: FontCdnViolation[];
  scannedFilesCount: number;
}

function getAllFiles(dirPath: string, extensions: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dirPath)) return results;

  const list = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, extensions));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

export function checkFontCdn(searchDirs?: string[]): CheckFontCdnResult {
  const dirs = searchDirs || [path.join(ROOT_DIR, 'astro', 'src'), path.join(ROOT_DIR, 'public')];

  const extensions = ['.astro', '.html', '.css', '.ts', '.tsx', '.js', '.mjs', '.jsx'];
  const scannedFiles: string[] = [];

  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      if (fs.statSync(dir).isDirectory()) {
        scannedFiles.push(...getAllFiles(dir, extensions));
      } else {
        scannedFiles.push(dir);
      }
    }
  }

  const violations: FontCdnViolation[] = [];

  for (const filePath of scannedFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((lineText, index) => {
      for (const pattern of FORBIDDEN_FONT_CDN_PATTERNS) {
        const match = lineText.match(pattern);
        if (match) {
          const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
          violations.push({
            file: relPath,
            line: index + 1,
            match: match[0],
            snippet: lineText.trim().slice(0, 100),
          });
          break;
        }
      }
    });
  }

  return {
    success: violations.length === 0,
    totalViolations: violations.length,
    violations,
    scannedFilesCount: scannedFiles.length,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const result = checkFontCdn();
  console.log('==================================================');
  console.log('      FONT CDN CI DRIFT GUARD VALIDATION CHECK     ');
  console.log('==================================================\n');
  console.log(`ℹ️ Scanned ${result.scannedFilesCount} template/style/script file(s).`);

  if (!result.success) {
    console.error(`\n❌ Found ${result.totalViolations} external font CDN reference(s):`);
    for (const v of result.violations) {
      console.error(` - ${v.file}:${v.line} -> "${v.match}"`);
      console.error(`   Snippet: ${v.snippet}`);
    }
    console.error('\n❌ Font CDN audit FAILED. External font CDNs are prohibited.');
    console.log('==================================================\n');
    process.exit(1);
  } else {
    console.log(`\n🎉 Font CDN audit PASSED! 0 external font CDN references detected.`);
    console.log('==================================================\n');
    process.exit(0);
  }
}
