const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Assuming glob is available or I'll implement simple walk

// Static routes that are not in services or localPages
const staticRoutes = [
  '/',
  '/about-us',
  '/contact-us',
  '/services',
  '/tracking',
  '/service-area',
  '/shipping-partners',
  '/privacy',
  '/terms',
  '/pickup-hours',
  '/ask-mailbox-plus',
  '/fedex-easy-returns', // These seem to be in internalLinks but let's ensure they are caught
  '/amazon-returns'      // These might be services, I'll check duplicates
];

function getAllServiceSlugs() {
  const servicesDir = path.join(__dirname, '../src/config/services');
  const slugs = new Set();

  // Recursive function to walk directory
  function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Regex to find slug property: slug: "/some-path" or slug: '/some-path'
        const matches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
        for (const match of matches) {
          if (match[1]) {
            slugs.add(match[1]);
          }
        }
      }
    });
  }

  walk(servicesDir);
  return Array.from(slugs);
}

function getLocalPageUrls() {
  const localPagesPath = path.join(__dirname, '../src/data/localPages.json');
  if (!fs.existsSync(localPagesPath)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(localPagesPath, 'utf-8'));
    return data.map(page => page.url).filter(Boolean);
  } catch (e) {
    console.error("Error reading localPages.json", e);
    return [];
  }
}

function generateRoutes() {
  const serviceSlugs = getAllServiceSlugs();
  const localPageUrls = getLocalPageUrls();
  
  const allRoutes = Array.from(new Set([
    ...staticRoutes,
    ...serviceSlugs,
    ...localPageUrls
  ])).sort();

  return allRoutes;
}

// If executed directly, print routes or write to file
if (require.main === module) {
  const routes = generateRoutes();
  console.log(JSON.stringify(routes, null, 2));
  
  // Optional: write to a JSON file that vite.config.ts can import
  const outputPath = path.join(__dirname, '../src/data/routes.json');
  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log(`Routes written to ${outputPath}`);
}

module.exports = { generateRoutes };