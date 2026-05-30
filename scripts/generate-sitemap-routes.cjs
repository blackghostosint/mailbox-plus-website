const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Static routes that might not be caught by scanning
const manualRoutes = [
  '/',
  // Add any routes here that are NOT in App.tsx or config files if needed
];

/**
 * Gets the last modified date for a file using git, falling back to fs stats, then current date.
 * Returns ISO string date.
 */
function getLastModified(filePath) {
  try {
    // 1. Try Git
    if (fs.existsSync(filePath)) {
      try {
        // %cI = committer date, ISO 8601-like format
        const gitDate = execSync(`git log -1 --format=%cI "${filePath}"`, {
          encoding: 'utf-8',
          timeout: 1000, // Don't hang forever
          stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
        }).trim();

        if (gitDate) {
          return new Date(gitDate).toISOString();
        }
      } catch (e) {
        // Git failed (not a repo, or git not installed), ignore and fall back
      }

      // 2. Fallback to FS stats
      const stats = fs.statSync(filePath);
      return stats.mtime.toISOString();
    }
  } catch (e) {
    console.warn(`Warning: Could not get date for ${filePath}: ${e.message}`);
  }

  // 3. Fallback to now
  return new Date().toISOString();
}

/**
 * Returns object with found slugs and mapping to source file
 * @returns {{slugs: string[], sourceMap: Record<string, string>}}
 */
function getAllServiceSlugs() {
  const servicesDir = path.join(__dirname, '../src/config/services');
  const slugs = new Set();
  const sourceMap = {}; // slug -> filePath

  if (!fs.existsSync(servicesDir)) {
    console.warn(`Warning: Services directory not found at ${servicesDir}`);
    return { slugs: [], sourceMap: {} };
  }

  // Recursive function to walk directory
  function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
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
            sourceMap[match[1]] = filePath;
          }
        }
      }
    });
  }

  walk(servicesDir);
  return { slugs: Array.from(slugs), sourceMap };
}

function getMicroProblemUrls() {
  const indexPath = path.join(__dirname, '../src/config/micro-problems/index.ts');
  const urls = [];
  const sourceMap = {};

  if (!fs.existsSync(indexPath)) {
    console.warn(`Warning: micro-problems index not found at ${indexPath}`);
    return { urls: [], sourceMap: {} };
  }

  try {
    const content = fs.readFileSync(indexPath, 'utf-8');

    const shardImports = [];
    const importMatches = content.matchAll(
      /import\s+\{\s*(\w+)\s*\}\s+from\s+['"]\.\/([\w-]+)['"]/g
    );
    for (const match of importMatches) {
      const varName = match[1];
      const fileName = match[2];
      shardImports.push({ varName, fileName });
    }

    for (const { fileName } of shardImports) {
      const shardPath = path.join(__dirname, `../src/config/micro-problems/${fileName}.ts`);

      if (!fs.existsSync(shardPath)) {
        console.warn(`Warning: Shard file not found at ${shardPath}`);
        continue;
      }

      const shardContent = fs.readFileSync(shardPath, 'utf-8');

      const objectMatches = shardContent.matchAll(
        /\{[^}]*category:\s*["']micro-problems?["'][^}]*\}/gs
      );

      for (const match of objectMatches) {
        const obj = match[0];

        const slugMatch = obj.match(/slug:\s*["']([^"']+)["']/);
        const categoryMatch = obj.match(/category:\s*["'](micro-problems?)["']/);
        const indexableMatch = obj.match(/indexable:\s*(false|true)/);

        if (categoryMatch && slugMatch) {
          const slug = slugMatch[1];
          const isIndexable = indexableMatch ? indexableMatch[1] !== 'false' : true;

          if (slug && slug.trim().length > 0 && isIndexable) {
            urls.push(slug);
            sourceMap[slug] = shardPath;
          }
        }
      }
    }

    return { urls, sourceMap };
  } catch (e) {
    console.error('Error reading micro-problems config', e);
    return { urls: [], sourceMap: {} };
  }
}

function getLocalPageUrls() {
  const urls = new Set();
  const sourceMap = {};

  // 1. Check serviceAreas.ts (Legacy/Config)
  const serviceAreasPath = path.join(__dirname, '../src/config/serviceAreas.ts');
  if (fs.existsSync(serviceAreasPath)) {
    try {
      const content = fs.readFileSync(serviceAreasPath, 'utf-8');
      const matches = content.matchAll(/canonicalUrl:\s*["']([^"']+)["']/g);
      for (const match of matches) {
        if (match[1]) {
          urls.add(match[1]);
          sourceMap[match[1]] = serviceAreasPath;
        }
      }
    } catch (e) {
      console.error('Error reading serviceAreas.ts', e);
    }
  }

  // 2. Check localPages.json (Data)
  const localPagesPath = path.join(__dirname, '../src/data/localPages.json');
  if (fs.existsSync(localPagesPath)) {
    try {
      const content = fs.readFileSync(localPagesPath, 'utf-8');
      const localPages = JSON.parse(content);
      if (Array.isArray(localPages)) {
        localPages.forEach((page) => {
          if (page.slug) {
            let url;
            if (page.canonical) {
              url = page.canonical;
            } else {
              url = `/service-area/${page.slug}`;
            }
            urls.add(url);
            sourceMap[url] = localPagesPath;
          }
        });
      }
    } catch (e) {
      console.error('Error reading localPages.json', e);
    }
  }

  return { urls: Array.from(urls), sourceMap };
}

function getAppRoutes() {
  const appPath = path.join(__dirname, '../src/App.tsx');
  const routes = new Set();
  const sourceMap = {};

  if (!fs.existsSync(appPath)) {
    console.warn(`Warning: App.tsx not found at ${appPath}`);
    return { routes: [], sourceMap: {} };
  }

  try {
    const content = fs.readFileSync(appPath, 'utf-8');
    const matches = content.matchAll(/<Route\s+path=["']([^"']+)["']/g);

    for (const match of matches) {
      const routePath = match[1];

      // Filter out dynamic routes (containing :) and wildcards (*)
      if (!routePath.includes(':') && !routePath.includes('*')) {
        routes.add(routePath);
        sourceMap[routePath] = appPath;
      }
    }
  } catch (e) {
    console.error('Error parsing App.tsx', e);
  }

  return { routes: Array.from(routes), sourceMap };
}

function generateRoutes() {
  const serviceData = getAllServiceSlugs();
  const microProblemData = getMicroProblemUrls();
  const localPageData = getLocalPageUrls();
  const appRouteData = getAppRoutes();

  // Combine all routes
  const allRoutes = Array.from(
    new Set([
      ...manualRoutes,
      ...serviceData.slugs,
      ...microProblemData.urls,
      ...localPageData.urls,
      ...appRouteData.routes,
    ])
  ).sort();

  // Combine source maps
  // Priority: if duplicate routes, subsequent sources overwrite previous ones.
  // Order here matters if there are collisions.
  const combinedSourceMap = {
    ...serviceData.sourceMap,
    ...microProblemData.sourceMap,
    ...localPageData.sourceMap,
    ...appRouteData.sourceMap,
  };

  // Calculate lastmod for each route
  const lastmod = {};

  allRoutes.forEach((route) => {
    let sourceFile = combinedSourceMap[route];

    // Default source for manual routes or anything missing
    if (!sourceFile) {
      if (route === '/') {
        sourceFile = path.join(__dirname, '../src/App.tsx');
      } else {
        // Fallback to App.tsx for unknown static routes as a safe bet
        sourceFile = path.join(__dirname, '../src/App.tsx');
      }
    }

    lastmod[route] = getLastModified(sourceFile);
  });

  return {
    routes: allRoutes,
    lastmod: lastmod,
  };
}

// If executed directly, print routes or write to file
if (require.main === module) {
  const config = generateRoutes();

  // New output file: sitemap-config.json
  const outputPath = path.join(__dirname, '../src/data/sitemap-config.json');
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
  console.log(
    `Successfully generated configuration for ${config.routes.length} routes to ${outputPath}`
  );
}

module.exports = { generateRoutes };
