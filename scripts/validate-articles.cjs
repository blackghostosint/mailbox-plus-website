const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Simple recursive directory walker
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const contentDir = path.resolve(__dirname, '../content/articles');
const errors = [];
const intentKeys = new Map();

console.log(`🔍 Scanning articles in ${contentDir}...`);

if (!fs.existsSync(contentDir)) {
    console.error(`❌ Content directory not found: ${contentDir}`);
    process.exit(1);
}

walkDir(contentDir, (filePath) => {
    if (path.extname(filePath) !== '.md') return;

    // Ignore README files
    if (path.basename(filePath).toLowerCase() === 'readme.md') return;

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Validate required fields
        const requiredFields = ['title', 'description', 'slug', 'category', 'intentKey', 'pubDate', 'image'];
        requiredFields.forEach(field => {
            if (!data[field]) {
                errors.push(`❌ ${path.basename(filePath)}: Missing required field '${field}'`);
            }
        });

        // Check intentKey uniqueness
        if (data.intentKey) {
            if (intentKeys.has(data.intentKey)) {
                errors.push(`❌ ${path.basename(filePath)}: Duplicate intentKey '${data.intentKey}' (also in ${intentKeys.get(data.intentKey)})`);
            } else {
                intentKeys.set(data.intentKey, path.basename(filePath));
            }
        }

        // Basic content check
        if (!content.trim()) {
            errors.push(`⚠️ ${path.basename(filePath)}: Article content is empty`);
        }

    } catch (err) {
        errors.push(`❌ ${path.basename(filePath)}: Parsing error - ${err.message}`);
    }
});

if (errors.length > 0) {
    console.error('\nFound validation errors:');
    errors.forEach(e => console.error(e));
    process.exit(1);
} else {
    console.log('\n✅ All articles validated successfully!');
}
