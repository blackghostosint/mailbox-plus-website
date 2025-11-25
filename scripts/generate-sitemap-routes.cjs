const fs = require('fs');
const path = require('path');

// Static routes that might not be caught by scanning
const manualRoutes = [
  '/',
  // Add any routes here that are NOT in App.tsx or config files if needed
];

function getAllServiceSlugs() {
  const servicesDir = path.join(__dirname, '../src/config/services');
  const slugs = new Set();

  if (!fs.existsSync(servicesDir)) {
      console.warn(`Warning: Services directory not found at ${servicesDir}`);
      return [];
  }

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
  const urls = new Set();

  // 1. Check serviceAreas.ts (Legacy/Config)
  const serviceAreasPath = path.join(__dirname, '../src/config/serviceAreas.ts');
  if (fs.existsSync(serviceAreasPath)) {
    try {
      const content = fs.readFileSync(serviceAreasPath, 'utf-8');
      const matches = content.matchAll(/canonicalUrl:\s*["']([^"']+)["']/g);
      for (const match of matches) {
        if (match[1]) urls.add(match[1]);
      }
    } catch (e) {
      console.error("Error reading serviceAreas.ts", e);
    }
  }

  // 2. Check localPages.json (Data)
  const localPagesPath = path.join(__dirname, '../src/data/localPages.json');
  if (fs.existsSync(localPagesPath)) {
      try {
          const content = fs.readFileSync(localPagesPath, 'utf-8');
          const localPages = JSON.parse(content);
          if (Array.isArray(localPages)) {
              localPages.forEach(page => {
                  if (page.slug) {
                      // Ensure it starts with /service-area/ if not present, though usually slug is just 'city-name'
                      // Based on App.tsx: <Route path="/service-area/:slug" ... />
                      // And localPages.json has "slug": "auburn-township"
                      // So we construct the full path.
                      // Note: localPages.json also has "canonical": "/service-area/auburn-township" which is easier!
                      if (page.canonical) {
                          urls.add(page.canonical);
                      } else {
                          urls.add(`/service-area/${page.slug}`);
                      }
                  }
              });
          }
      } catch (e) {
          console.error("Error reading localPages.json", e);
      }
  }

  return Array.from(urls);
}

function getAppRoutes() {
    const appPath = path.join(__dirname, '../src/App.tsx');
    const routes = new Set();
    
    if (!fs.existsSync(appPath)) {
        console.warn(`Warning: App.tsx not found at ${appPath}`);
        return [];
    }

    try {
        const content = fs.readFileSync(appPath, 'utf-8');
        // Look for <Route path="/some-path" ... />
        // Regex needs to handle potential whitespace and both quote types
        const matches = content.matchAll(/<Route\s+path=["']([^"']+)["']/g);
        
        for (const match of matches) {
            const routePath = match[1];
            
            // Filter out dynamic routes (containing :) and wildcards (*)
            if (!routePath.includes(':') && !routePath.includes('*')) {
                routes.add(routePath);
            }
        }
    } catch (e) {
        console.error("Error parsing App.tsx", e);
    }
    
    return Array.from(routes);
}

function generateRoutes() {
  const serviceSlugs = getAllServiceSlugs();
  const localPageUrls = getLocalPageUrls();
  const appRoutes = getAppRoutes();
  
  const allRoutes = Array.from(new Set([
    ...manualRoutes,
    ...serviceSlugs,
    ...localPageUrls,
    ...appRoutes
  ])).sort();

  return allRoutes;
}

// If executed directly, print routes or write to file
if (require.main === module) {
  const routes = generateRoutes();
  
  // Optional: write to a JSON file that vite.config.ts can import
  const outputPath = path.join(__dirname, '../src/data/routes.json');
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log(`Successfully generated ${routes.length} routes to ${outputPath}`);
}

module.exports = { generateRoutes };