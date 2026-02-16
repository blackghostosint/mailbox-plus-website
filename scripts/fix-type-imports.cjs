/**
 * Fixes verbatimModuleSyntax errors (ts 1484) by converting type-only imports
 * to use the `import type` syntax or inline `type` keyword.
 *
 * Before: import { Service } from "../types/services";
 * After:  import type { Service } from "../types/services";
 *
 * For mixed imports (value + type from same module):
 * Before: import { someValue, SomeType } from "./module";
 * After:  import { someValue, type SomeType } from "./module";
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Files and their type-only symbols that need fixing (from astro check output)
const fixes = [
    // services.ts types
    { file: 'src/components/ServicePageV2.tsx', symbol: 'Service', module: '../types/services' },
    { file: 'src/components/VisitUsButton.tsx', symbol: 'ButtonProps', module: './ui/Button' },
    { file: 'src/components/ui/Breadcrumbs.tsx', symbol: 'Service', module: '../../types/services' },
    { file: 'src/components/ui/InternalLink.tsx', symbol: 'LinkProps', module: 'react-router-dom' },
    { file: 'src/config/categories.ts', symbol: 'ServiceCategory', module: '../types/services' },
    { file: 'src/config/serviceAreas.ts', symbol: 'Service', module: '../types/services' },
    { file: 'src/config/services.ts', symbol: 'Service', module: '../types/services' },
    { file: 'src/types/services.ts', symbol: 'FAQ', module: './faq' },
    { file: 'src/utils/articleLoader.ts', symbols: ['Article', 'ArticleFrontmatter'], module: '../types/article.types' },
    { file: 'src/utils/services-helpers.ts', symbols: ['Service', 'ServiceCategory'], module: '../types/services' },
    // FAQ files
    { file: 'src/config/faqs/generalCopyPrintFaqs.ts', symbol: 'FAQ', module: '../../types/faq' },
    { file: 'src/config/faqs/generalHomeBusinessFaqs.ts', symbol: 'FAQ', module: '../../types/faq' },
    { file: 'src/config/faqs/generalShippingFaqs.ts', symbol: 'FAQ', module: '../../types/faq' },
    { file: 'src/config/faqs/copy-print/businessCardsFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/copy-print/copiesFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/copy-print/documentPrintingFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/copy-print/flyersBrochuresFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/copy-print/graphicDesignFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/copy-print/postcardFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/copy-print/postersBannersFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/home-business/digitalMailboxFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/home-business/documentScanningFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/home-business/everyDoorFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/home-business/faxFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/home-business/mailboxRentalFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/home-business/notaryFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/home-business/shreddingFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/artworkFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/bicycleFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/customBoxFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/dhlFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/fedexFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/golfFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/packageDropOffsFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/packageReceivingFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/packagingSuppliesFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/postageStampsFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/professionalPackingFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/upsFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
    { file: 'src/config/faqs/pack-ship/uspsFaqs.ts', symbol: 'FAQ', module: '../../../types/faq' },
];

const root = path.join(__dirname, '..');

function fixFile(filePath, symbols, module) {
    const abs = path.join(root, filePath);
    if (!fs.existsSync(abs)) {
        console.log(`  SKIP (not found): ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(abs, 'utf8');
    const symbolList = symbols.join('|');

    // Match: import { sym1, sym2 } from 'module'
    // where some symbols need to be type imports
    const importRegex = new RegExp(
        `import \\{([^}]+)\\} from ['"]${module.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`
    );

    const match = content.match(importRegex);
    if (!match) {
        // Try import type already there
        if (content.includes(`import type {`) && content.includes(module)) {
            return false;
        }
        console.log(`  SKIP (no match): ${filePath} - looking for: ${module}`);
        return false;
    }

    const importedNames = match[1].split(',').map(s => s.trim().replace(/^type\s+/, ''));
    const typeSymbols = new Set(symbols);

    // Check if ALL imports are type-only
    const allTypes = importedNames.every(name => typeSymbols.has(name));

    let newImport;
    if (allTypes) {
        // Convert to import type { ... }
        newImport = match[0].replace('import {', 'import type {');
    } else {
        // Add inline `type` keyword to each type symbol
        const newNames = importedNames.map(name =>
            typeSymbols.has(name) ? `type ${name}` : name
        ).join(', ');
        newImport = `import { ${newNames} } from '${module}'`;
    }

    const newContent = content.replace(match[0], newImport);
    if (newContent === content) return false;

    fs.writeFileSync(abs, newContent, 'utf8');
    return true;
}

let fixed = 0;
for (const fix of fixes) {
    const symbols = fix.symbols || [fix.symbol];
    const result = fixFile(fix.file, symbols, fix.module);
    if (result) {
        fixed++;
        console.log(`✓ ${fix.file}`);
    }
}

console.log(`\nFixed ${fixed} files.`);
