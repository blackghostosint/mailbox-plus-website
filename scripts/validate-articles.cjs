const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const sitemapConfig = require('../src/data/sitemap-config.json');
const validRoutes = new Set(sitemapConfig.routes);

// Simple recursive directory walker
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const contentDir = path.resolve(__dirname, '../content/articles');
const errors = [];
const intentKeys = new Map();
let linkCount = 0;
let articleCount = 0;

console.log(`🔍 Scanning articles in ${contentDir}...`);

if (!fs.existsSync(contentDir)) {
  console.error(`❌ Content directory not found: ${contentDir}`);
  process.exit(1);
}

walkDir(contentDir, (filePath) => {
  if (path.extname(filePath) !== '.md') return;

  // Ignore README files
  if (path.basename(filePath).toLowerCase() === 'readme.md') return;

  articleCount++;

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'slug',
      'category',
      'intentKey',
      'pubDate',
      'image',
    ];
    requiredFields.forEach((field) => {
      if (!data[field]) {
        errors.push(`❌ ${path.basename(filePath)}: Missing required field '${field}'`);
      }
    });

    // Check intentKey uniqueness
    if (data.intentKey) {
      if (intentKeys.has(data.intentKey)) {
        errors.push(
          `❌ ${path.basename(filePath)}: Duplicate intentKey '${data.intentKey}' (also in ${intentKeys.get(data.intentKey)})`
        );
      } else {
        intentKeys.set(data.intentKey, path.basename(filePath));
      }
    }

    // Basic content check
    if (!content.trim()) {
      errors.push(`⚠️ ${path.basename(filePath)}: Article content is empty`);
    }

    // Validate relatedServices paths
    if (Array.isArray(data.relatedServices)) {
      data.relatedServices.forEach((servicePath) => {
        linkCount++;
        if (!validRoutes.has(servicePath)) {
          errors.push(
            `❌ ${path.basename(filePath)}: relatedServices path '${servicePath}' does not match any known route`
          );
        }
      });
    }

    // Validate internal markdown links in body
    const linkRegex = /\[([^\]]*)\]\((\/[^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const linkPath = match[2];
      linkCount++;
      if (!validRoutes.has(linkPath)) {
        errors.push(
          `❌ ${path.basename(filePath)}: Markdown link '${linkPath}' does not match any known route`
        );
      }
    }
  } catch (err) {
    errors.push(`❌ ${path.basename(filePath)}: Parsing error - ${err.message}`);
  }
});

if (errors.length > 0) {
  console.error('\nFound validation errors:');
  errors.forEach((e) => console.error(e));
  console.log(`\n🔗 Validated ${linkCount} internal links across ${articleCount} articles.`);
  process.exit(1);
} else {
  console.log('\n✅ All articles validated successfully!');
  console.log(`🔗 Validated ${linkCount} internal links across ${articleCount} articles.`);
}
