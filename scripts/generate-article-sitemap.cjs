const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const contentDir = path.resolve(__dirname, '../content/articles');
const sitemapConfigPath = path.resolve(__dirname, '../src/data/sitemap-config.json');

if (!fs.existsSync(contentDir) || !fs.existsSync(sitemapConfigPath)) {
    console.error('❌ Content directory or sitemap config not found');
    process.exit(1);
}

const sitemapConfig = JSON.parse(fs.readFileSync(sitemapConfigPath, 'utf8'));
const newRoutes = [];
const newLastmod = {};

console.log(`🔍 Scanning articles in ${contentDir}...`);

walkDir(contentDir, (filePath) => {
    if (path.extname(filePath) !== '.md') return;

    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = content.match(frontmatterRegex);

    if (match) {
        const frontmatterRaw = match[1];
        let slug = '';
        let pubDate = '';

        frontmatterRaw.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim().replace(/^"|"$/g, '');
                if (key === 'slug') slug = value;
                if (key === 'pubDate') pubDate = value;
            }
        });

        if (slug) {
            const route = `/articles/${slug}`;
            if (!sitemapConfig.routes.includes(route)) {
                newRoutes.push(route);
                console.log(`➕ Added route: ${route}`);
            }

            // Always update lastmod if pubDate exists
            if (pubDate) {
                // Convert to ISO string if needed, assuming pubDate is already ISO-like or valid date string
                try {
                    const isoDate = new Date(pubDate).toISOString();
                    sitemapConfig.lastmod[route] = isoDate;
                    newLastmod[route] = isoDate;
                } catch (e) {
                    console.warn(`⚠️ Invalid date for ${slug}: ${pubDate}`);
                }
            }
        }
    }
});

// Merge new routes
if (newRoutes.length > 0) {
    sitemapConfig.routes = [...sitemapConfig.routes, ...newRoutes].sort();
    fs.writeFileSync(sitemapConfigPath, JSON.stringify(sitemapConfig, null, 2));
    console.log(`✅ Added ${newRoutes.length} new routes to sitemap-config.json`);
} else {
    console.log('✅ No new routes found.');
}
