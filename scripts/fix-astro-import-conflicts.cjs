/**
 * Fixes ts(2440) errors in .astro pages by aliasing the page component import.
 *
 * Before: import { AboutUs } from '../page-components/AboutUs';
 *         <WithProviders component={AboutUs} client:only="react" />
 *
 * After:  import { AboutUs as AboutUsPage } from '../page-components/AboutUs';
 *         <WithProviders component={AboutUsPage} client:only="react" />
 */

const fs = require('fs');
const path = require('path');

const conflictingFiles = [
    'src/pages/about-us.astro',
    'src/pages/ask-mailbox-plus.astro',
    'src/pages/contact-us.astro',
    'src/pages/copy-print/copies.astro',
    'src/pages/copy-print/document-printing.astro',
    'src/pages/copy-print/flyers-brochures.astro',
    'src/pages/copy-print/graphic-design.astro',
    'src/pages/copy-print/postcard-printing.astro',
    'src/pages/copy-print/posters-printing.astro',
    'src/pages/home-business/digital-mailbox-rental.astro',
    'src/pages/home-business/document-scanning.astro',
    'src/pages/home-business/every-door-direct-mail.astro',
    'src/pages/home-business/fax-services.astro',
    'src/pages/home-business/notary-services.astro',
    'src/pages/home-business/shredding.astro',
    'src/pages/nuuly-returns.astro',
    'src/pages/pack-ship/artwork-shipping.astro',
    'src/pages/pack-ship/bicycle-shipping.astro',
    'src/pages/pack-ship/custom-box-making.astro',
    'src/pages/pack-ship/golf-club-shipping.astro',
    'src/pages/pack-ship/package-drop-offs.astro',
    'src/pages/pack-ship/package-receiving.astro',
    'src/pages/pack-ship/packaging-supplies.astro',
    'src/pages/pack-ship/postage-stamps.astro',
    'src/pages/pack-ship/professional-packing.astro',
    'src/pages/pickup-hours.astro',
    'src/pages/privacy.astro',
    'src/pages/services.astro',
    'src/pages/shipping-partners.astro',
    'src/pages/specialty/digital-fingerprinting.astro',
    'src/pages/specialty/insurance.astro',
    'src/pages/terms.astro',
    'src/pages/tracking.astro',
];

const root = path.join(__dirname, '..');
let fixed = 0;

for (const relPath of conflictingFiles) {
    const filePath = path.join(root, relPath);
    let content = fs.readFileSync(filePath, 'utf8');

    // Match: import { SomeName } from '...page-components/...' or import SomeName from '...'
    // For named imports: import { ComponentName } from '...'
    const namedImportRegex = /import \{ (\w+) \} from '([^']*page-components[^']*)';/;
    // For default imports: import ComponentName from '...'
    const defaultImportRegex = /import (\w+) from '([^']*page-components[^']*)';/;

    let componentName = null;
    let matchType = null;

    const namedMatch = content.match(namedImportRegex);
    const defaultMatch = content.match(defaultImportRegex);

    if (namedMatch) {
        componentName = namedMatch[1];
        matchType = 'named';
    } else if (defaultMatch && !defaultMatch[1].includes('Layout') && !defaultMatch[1].includes('pageMeta')) {
        componentName = defaultMatch[1];
        matchType = 'default';
    }

    if (!componentName) {
        console.log(`  SKIP (no component found): ${relPath}`);
        continue;
    }

    const alias = `${componentName}Page`;

    // Replace import
    let newContent;
    if (matchType === 'named') {
        newContent = content.replace(
            `import { ${componentName} } from`,
            `import { ${componentName} as ${alias} } from`
        );
    } else {
        newContent = content.replace(
            `import ${componentName} from`,
            `import ${componentName} as ${alias} from`
        );
    }

    // Replace usage in WithProviders
    newContent = newContent.replace(
        `component={${componentName}}`,
        `component={${alias}}`
    );

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        fixed++;
        console.log(`✓ ${relPath} (${componentName} → ${alias})`);
    } else {
        console.log(`  SKIP (no change): ${relPath}`);
    }
}

console.log(`\nFixed ${fixed} files.`);
