/**
 * Updates all .astro page files to wrap React islands with WithProviders,
 * which provides BrowserRouter and HelmetProvider context.
 *
 * Before: <ComponentName client:only="react" />
 * After:  <WithProviders component={ComponentName} client:only="react" />
 *
 * Before: <ComponentName slug={slug} client:only="react" />
 * After:  <WithProviders component={ComponentName} slug={slug} client:only="react" />
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

function getRelativeProviderPath(astroFilePath) {
    // Compute relative path from the .astro file to src/page-components/WithProviders
    const providerAbs = path.join(__dirname, '..', 'src', 'page-components', 'WithProviders');
    const fileDir = path.dirname(astroFilePath);
    let rel = path.relative(fileDir, providerAbs).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel;
}

function updateAstroFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip files that already have WithProviders
    if (content.includes('WithProviders')) return false;

    // Match island components: <SomeComponent [props] client:only="react" />
    // Captures: component name + optional props (everything before client:only)
    const islandRegex = /<([A-Z][A-Za-z0-9]*)([^>]*?)\s+client:only="react"\s*\/>/g;

    let matched = false;
    const newContent = content.replace(islandRegex, (match, componentName, props) => {
        matched = true;
        const trimmedProps = props.trim();
        if (trimmedProps) {
            return `<WithProviders component={${componentName}} ${trimmedProps} client:only="react" />`;
        } else {
            return `<WithProviders component={${componentName}} client:only="react" />`;
        }
    });

    if (!matched) return false;

    // Add WithProviders import after the last existing import in the frontmatter
    const providerPath = getRelativeProviderPath(filePath);

    // Insert WithProviders import before the closing ---
    const importLine = `import { WithProviders } from '${providerPath}';\n`;
    const updatedContent = newContent.replace(
        /(import [^\n]+\n)(---\n\n)/,
        (match, lastImport, closing) => lastImport + importLine + closing
    );

    // If that pattern didn't match (import is last line before ---), try another pattern
    const finalContent = updatedContent.includes("import { WithProviders }")
        ? updatedContent
        : newContent.replace(/^(---\n[\s\S]*?)(---\n)/, (match, frontmatter, closing) => {
            // Add import at end of frontmatter block
            return frontmatter + importLine + closing;
        });

    fs.writeFileSync(filePath, finalContent, 'utf8');
    return true;
}

// Find all .astro files
const astroFiles = glob.sync('**/*.astro', { cwd: pagesDir, absolute: true });

let updated = 0;
let skipped = 0;

for (const file of astroFiles) {
    const result = updateAstroFile(file);
    if (result) {
        updated++;
        console.log(`✓ Updated: ${path.relative(path.join(__dirname, '..'), file)}`);
    } else {
        skipped++;
    }
}

console.log(`\nDone. ${updated} files updated, ${skipped} skipped.`);
