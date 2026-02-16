/**
 * Fixes WithProviders import placement in .astro files.
 * Ensures the import is at the top of the frontmatter (with other imports),
 * not after const declarations.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

function getRelativeProviderPath(astroFilePath) {
    const providerAbs = path.join(__dirname, '..', 'src', 'page-components', 'WithProviders');
    const fileDir = path.dirname(astroFilePath);
    let rel = path.relative(fileDir, providerAbs).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel;
}

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Only process files that use WithProviders
    if (!content.includes('WithProviders')) return false;

    const providerPath = getRelativeProviderPath(filePath);
    const importLine = `import { WithProviders } from '${providerPath}';`;

    // Remove any existing WithProviders import (wherever it currently is)
    content = content.replace(/\nimport \{ WithProviders \} from '[^']+';/g, '');
    content = content.replace(/^import \{ WithProviders \} from '[^']+'\n/gm, '');

    // Extract the frontmatter block
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return false;

    const frontmatter = frontmatterMatch[1];

    // Split frontmatter into import lines and non-import lines
    const lines = frontmatter.split('\n');
    const importLines = [];
    const otherLines = [];
    let inImportSection = true;

    for (const line of lines) {
        if (inImportSection && (line.startsWith('import ') || line === '')) {
            importLines.push(line);
        } else {
            inImportSection = false;
            otherLines.push(line);
        }
    }

    // Remove trailing empty lines from importLines
    while (importLines.length > 0 && importLines[importLines.length - 1] === '') {
        importLines.pop();
    }

    // Add the WithProviders import at the end of the import section
    importLines.push(importLine);

    // Rebuild frontmatter
    const newFrontmatter = [
        ...importLines,
        '',
        ...otherLines,
    ].join('\n');

    // Replace the old frontmatter
    const newContent = content.replace(
        /^---\n[\s\S]*?\n---/,
        `---\n${newFrontmatter}\n---`
    );

    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
}

const astroFiles = glob.sync('**/*.astro', { cwd: pagesDir, absolute: true });

let fixed = 0;
for (const file of astroFiles) {
    if (fixFile(file)) {
        fixed++;
        console.log(`✓ Fixed: ${path.relative(path.join(__dirname, '..'), file)}`);
    }
}

console.log(`\nFixed ${fixed} files.`);
