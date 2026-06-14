const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const FAQS_SRC = path.join(PROJECT_ROOT, 'src/config/faqs');
const FAQS_DST = path.join(PROJECT_ROOT, 'public/data/faqs');

if (!fs.existsSync(FAQS_DST)) {
  fs.mkdirSync(FAQS_DST, { recursive: true });
}

function parseFAQFile(content) {
  const result = {};
  const exportRegex = /export\s+const\s+(\w+)\s*:\s*FAQ\[\]\s*=\s*(\[[\s\S]*?^\s*\]);/gm;
  let match;

  while ((match = exportRegex.exec(content)) !== null) {
    const arrayName = match[1];
    let arrayContent = match[2];

    try {
      let jsonStr = arrayContent;

      // Replace smart quotes
      jsonStr = jsonStr.replace(/[\u2018\u2019]/g, "'");
      jsonStr = jsonStr.replace(/[\u201c\u201d]/g, '"');

      // Remove trailing commas
      jsonStr = jsonStr.replace(/,\s*}/g, '}');
      jsonStr = jsonStr.replace(/,\s*]/g, ']');

      // Handle template literals - replace ${...} with evaluated expression
      jsonStr = jsonStr.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        // For simple string concatenations, just return the expression as string
        return '"' + expr.replace(/['"`]/g, '') + '"';
      });

      // Handle unquoted property names
      jsonStr = jsonStr.replace(/(\w+):\s*/g, '"$1": ');

      // Fix single-quoted strings to double-quoted
      jsonStr = jsonStr.replace(/'([^']*)'/g, '"$1"');

      // Remove trailing commas
      jsonStr = jsonStr.replace(/,\s*}/g, '}');
      jsonStr = jsonStr.replace(/,\s*]/g, ']');

      const parsed = JSON.parse(jsonStr);
      result[arrayName] = parsed;
    } catch (e) {
      console.warn(`  Failed to parse ${arrayName}: ${e.message}`);
    }
  }

  return result;
}

async function extractFAQs() {
  if (!fs.existsSync(FAQS_DST)) {
    fs.mkdirSync(FAQS_DST, { recursive: true });
  }

  const categories = fs
    .readdirSync(FAQS_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  console.log('Processing FAQ categories:', categories);

  let totalFAQs = 0;
  const manifest = {};

  for (const category of categories) {
    const categorySrc = path.join(FAQS_SRC, category);

    if (!fs.existsSync(categorySrc)) continue;

    const files = fs.readdirSync(categorySrc).filter((f) => f.endsWith('.ts') && f !== 'index.ts');

    if (!fs.existsSync(path.join(FAQS_DST, category))) {
      fs.mkdirSync(path.join(FAQS_DST, category), { recursive: true });
    }

    let categoryTotal = 0;

    for (const file of files) {
      const filePath = path.join(FAQS_SRC, category, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check if file has FAQ exports
      if (!content.includes('export const') || !content.includes('FAQ[]')) continue;

      const exportRegex = /export\s+const\s+(\w+)\s*:\s*FAQ\[\]\s*=\s*(\[[\s\S]*?^\s*\]);/gm;
      let match;

      while ((match = exportRegex.exec(content)) !== null) {
        const arrayName = match[1];
        let arrayContent = match[2];

        try {
          let jsonStr = arrayContent;

          // Replace smart quotes
          jsonStr = jsonStr.replace(/[\u2018\u2019]/g, "'");
          jsonStr = jsonStr.replace(/[\u201c\u201d]/g, '"');

          // Remove trailing commas
          jsonStr = jsonStr.replace(/,\s*}/g, '}');
          jsonStr = jsonStr.replace(/,\s*]/g, ']');

          // Handle template literals - replace ${...} with evaluated expression
          jsonStr = jsonStr.replace(/\$\{([^}]+)\}/g, (_, expr) => {
            return '"' + expr.replace(/['"`]/g, '') + '"';
          });

          // Handle unquoted property names
          jsonStr = jsonStr.replace(/(\w+):\s*/g, '"$1": ');

          // Fix single-quoted strings
          jsonStr = jsonStr.replace(/'([^']*)'/g, '"$1"');

          // Remove trailing commas
          jsonStr = jsonStr.replace(/,\s*}/g, '}');
          jsonStr = jsonStr.replace(/,\s*]/g, ']');

          const parsed = JSON.parse(jsonStr);

          // Filter valid FAQ objects
          const validFAQs = parsed.filter((faq) => faq && faq.question && faq.answer);

          if (validFAQs.length > 0) {
            const fileName = file.replace('.ts', '');
            const outPath = path.join(
              __dirname,
              '..',
              'public',
              'data',
              'faqs',
              category,
              `${fileName}.json`
            );

            if (!fs.existsSync(path.dirname(outPath))) {
              fs.mkdirSync(path.dirname(outPath), { recursive: true });
            }

            fs.writeFileSync(outPath, JSON.stringify(validFAQs, null, 2));
            console.log(`  ${category}/${fileName}.json: ${validFAQs.length} FAQs`);
            totalFAQs += validFAQs.length;

            if (!manifest[category]) manifest[category] = [];
            manifest[category].push(`${fileName}.json`);
          }
        } catch (e) {
          console.warn(`  Failed to parse ${arrayName} in ${file}: ${e.message}`);
        }
      }
    }
  }

  // Write manifest
  fs.writeFileSync(
    path.join(__dirname, '..', 'public', 'data', 'faqs', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\nTotal FAQs extracted: ${totalFAQs}`);
  console.log('Manifest written to public/data/faqs/manifest.json');
}

// Run
extractFAQs().catch(console.error);
