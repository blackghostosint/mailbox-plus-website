/**
 * Creates per-page island wrapper components in src/page-islands/
 * and updates all .astro pages to import them directly.
 *
 * WHY: Astro cannot serialize React components as props to client:only islands.
 * Passing `component={SomeComponent}` results in null on the client.
 * The fix is a self-contained island per page where no React function is a prop.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const root = path.join(__dirname, '..');
const pagesDir = path.join(root, 'src', 'pages');
const islandsDir = path.join(root, 'src', 'page-islands');

if (!fs.existsSync(islandsDir)) {
    fs.mkdirSync(islandsDir, { recursive: true });
}

// Dynamic pages that need slug props – handled separately
const DYNAMIC_PAGES = new Set([
    'articles/[slug].astro',
    'service-area/[slug].astro',
]);

function parseAstroPage(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract component import: named or default
    const namedMatch = content.match(/import \{ (\w+?)(?:Page)? \} from '([^']+page-components[^']*)'/);
    const namedAsMatch = content.match(/import \{ (\w+) as (\w+) \} from '([^']+page-components[^']*)'/);
    const defaultMatch = content.match(/import (\w+?) from '([^']+page-components[^']*)'/);

    // WithProviders usage - extract original component name
    const withProvidersMatch = content.match(/<WithProviders component=\{(\w+)\}/);

    let componentName = null;
    let importPath = null;
    let isDefault = false;
    let isNamed = false;
    let originalExportName = null; // the actual export name (e.g. "AboutUs" not "AboutUsPage")

    if (withProvidersMatch) {
        const usedName = withProvidersMatch[1]; // e.g. "AboutUsPage" or "AboutUs"

        // Find matching import
        if (namedAsMatch) {
            // import { AboutUs as AboutUsPage } from '...'
            originalExportName = namedAsMatch[1]; // "AboutUs"
            componentName = namedAsMatch[2]; // "AboutUsPage"
            importPath = namedAsMatch[3];
            isNamed = true;
        } else if (namedMatch && namedMatch[1] === usedName) {
            originalExportName = namedMatch[1];
            componentName = namedMatch[1];
            importPath = namedMatch[2];
            isNamed = true;
        } else if (defaultMatch && defaultMatch[1] !== 'Layout' && defaultMatch[1] !== 'ArticlesIndex') {
            originalExportName = defaultMatch[1];
            componentName = defaultMatch[1];
            importPath = defaultMatch[2];
            isDefault = true;
        } else if (defaultMatch && defaultMatch[1] === 'ArticlesIndex') {
            originalExportName = defaultMatch[1];
            componentName = defaultMatch[1];
            importPath = defaultMatch[2];
            isDefault = true;
        }

        // For the cases where name ends in "Page" from aliasing
        if (namedAsMatch && usedName === namedAsMatch[2]) {
            originalExportName = namedAsMatch[1];
            componentName = namedAsMatch[1]; // use original name for island
            importPath = namedAsMatch[3];
            isNamed = true;
        }
    }

    return { componentName, importPath, isDefault, isNamed, originalExportName, content };
}

function getIslandRelativePath(astroFilePath, islandFile) {
    const fileDir = path.dirname(astroFilePath);
    let rel = path.relative(fileDir, islandFile).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel.replace(/\.tsx$/, '');
}

function getComponentRelativePath(islandFile, componentImportPath, astroFilePath) {
    // componentImportPath is relative to the .astro file
    // we need it relative to the island file
    const astroDir = path.dirname(astroFilePath);
    const componentAbsPath = path.resolve(astroDir, componentImportPath);
    const islandDir = path.dirname(islandFile);
    let rel = path.relative(islandDir, componentAbsPath).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel;
}

const astroFiles = glob.sync('**/*.astro', { cwd: pagesDir, absolute: true });
// Also handle dynamic pages which glob skips
const dynamicFiles = [
    path.join(pagesDir, 'articles', '[slug].astro'),
    path.join(pagesDir, 'service-area', '[slug].astro'),
].filter(f => fs.existsSync(f));

const allFiles = [...astroFiles, ...dynamicFiles];

let created = 0;
let updated = 0;

for (const astroFile of allFiles) {
    const relAstro = path.relative(pagesDir, astroFile).replace(/\\/g, '/');

    // Skip dynamic pages with special handling below
    if (DYNAMIC_PAGES.has(relAstro)) {
        continue;
    }

    const { componentName, importPath, isDefault, isNamed, originalExportName, content } = parseAstroPage(astroFile);

    if (!componentName || !importPath) {
        continue;
    }

    // Island file path
    const islandFileName = `${componentName}Island.tsx`;
    const islandFilePath = path.join(islandsDir, islandFileName);

    // Compute import path from island to component
    const compRelPath = getComponentRelativePath(islandFilePath, importPath, astroFile);

    // Generate island file
    const importStatement = isDefault
        ? `import ${originalExportName} from '${compRelPath}';`
        : `import { ${originalExportName} } from '${compRelPath}';`;

    const islandContent = `import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
${importStatement}

export default function ${componentName}Island() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <${originalExportName} />
            </BrowserRouter>
        </HelmetProvider>
    );
}
`;

    fs.writeFileSync(islandFilePath, islandContent, 'utf8');
    created++;

    // Update the .astro page
    const islandRelFromAstro = getIslandRelativePath(astroFile, islandFilePath);

    let newContent = content;

    // Remove old component import and WithProviders import
    // Remove: import { XxxPage } from '...' or import { Xxx as XxxPage } from '...'
    newContent = newContent.replace(/\nimport \{ \w+ as \w+ \} from '[^']*page-components[^']*';/, '');
    newContent = newContent.replace(/\nimport \{ \w+ \} from '[^']*page-components[^']*';/, '');
    newContent = newContent.replace(/\nimport \w+ from '[^']*page-components[^']*';/, '');
    newContent = newContent.replace(/\nimport \{ WithProviders \} from '[^']*WithProviders[^']*';/, '');

    // Add island import
    const islandImport = `\nimport ${componentName}Island from '${islandRelFromAstro}';`;
    newContent = newContent.replace(/\n(import Layout from)/, `${islandImport}\n$1`);

    // Replace WithProviders usage
    newContent = newContent.replace(
        /<WithProviders component=\{\w+\}[^/]*client:only="react" \/>/,
        `<${componentName}Island client:only="react" />`
    );

    fs.writeFileSync(astroFile, newContent, 'utf8');
    updated++;
}

// Handle dynamic pages manually
function updateDynamicPage(filePath, islandFileName, islandContent, usageTemplate) {
    const islandFilePath = path.join(islandsDir, islandFileName);
    fs.writeFileSync(islandFilePath, islandContent, 'utf8');
    created++;

    const content = fs.readFileSync(filePath, 'utf8');
    const islandRelFromAstro = getIslandRelativePath(filePath, islandFilePath);

    let newContent = content;
    newContent = newContent.replace(/\nimport \{ \w+ \} from '[^']*page-components[^']*';/, '');
    newContent = newContent.replace(/\nimport \{ WithProviders \} from '[^']*WithProviders[^']*';/, '');
    newContent = newContent.replace(
        /^\nimport \{ \w+ as \w+ \} from '[^']*page-components[^']*';/m, ''
    );

    const islandImport = `\nimport ${islandFileName.replace('.tsx', '')} from '${islandRelFromAstro}';`;
    newContent = newContent.replace(/\n(import \{? articleLoader)|\n(import \{? serviceAreas)/, `${islandImport}\n$1$2`);

    newContent = newContent.replace(
        /<WithProviders component=\{\w+\}[^/]*client:only="react" \/>/,
        usageTemplate
    );

    fs.writeFileSync(filePath, newContent, 'utf8');
    updated++;
}

// Articles [slug].astro
updateDynamicPage(
    path.join(pagesDir, 'articles', '[slug].astro'),
    'ArticlePageIsland.tsx',
    `import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ArticlePageContent } from '../page-components/ArticlePage';

interface Props { slug: string; }

export default function ArticlePageIsland({ slug }: Props) {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ArticlePageContent slug={slug} />
            </BrowserRouter>
        </HelmetProvider>
    );
}
`,
    `<ArticlePageIsland slug={slug} client:only="react" />`
);

// Service Area [slug].astro
updateDynamicPage(
    path.join(pagesDir, 'service-area', '[slug].astro'),
    'ServiceAreaIsland.tsx',
    `import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ServiceAreaContent } from '../page-components/ServiceAreaPage';

interface Props { slug: string; }

export default function ServiceAreaIsland({ slug }: Props) {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ServiceAreaContent slug={slug} />
            </BrowserRouter>
        </HelmetProvider>
    );
}
`,
    `<ServiceAreaIsland slug={slug} client:only="react" />`
);

console.log(`\nCreated ${created} island files in src/page-islands/`);
console.log(`Updated ${updated} .astro page files`);
