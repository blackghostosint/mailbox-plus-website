import fs from 'fs';
import path from 'path';

const SERVICES_DIR = path.join(process.cwd(), 'src/config/services');

// Helper to find all .ts files recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
        arrayOfFiles.push(path.join(dirPath, '/', file));
      }
    }
  });
  return arrayOfFiles;
}

function runDiagnostic() {
  try {
    const files = getAllFiles(SERVICES_DIR);

    let totalServices = 0;
    const serviceIds: string[] = [];
    const servicesLoaded: Array<{ id: string; success: boolean; file: string }> = [];

    // Specific checks
    let artworkFound = false;
    let bicycleFound = false;
    let golfFound = false;

    let bicycleContentCheck = {
      hasFeatures: false,
      hasContent: false,
      hasFaq: false,
      hasCta: false,
    };

    files.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');

      // Regex to find service objects.
      // Looking for id: "something" or id: 'something'
      const idRegex = /id:\s*["']([^"']+)["']/g;
      let match;

      while ((match = idRegex.exec(content)) !== null) {
        const id = match[1];
        // Exclude category definitions if they look like services but aren't (usually verify via other fields)
        // But typically only services have 'id' in this codebase structure (categories usually implicitly handled or different file)
        // We'll assume if it has 'id', 'serviceName' or 'slug' logic nearby it's a service.

        // Simple check: does the file content likely contain service definition?
        // The regex match is good enough for counting.

        serviceIds.push(id);
        servicesLoaded.push({ id, success: true, file: path.basename(file) });
        totalServices++;

        if (id === 'artwork-shipping') artworkFound = true;
        if (id === 'bicycle-shipping') {
          bicycleFound = true;
          // Check for fields in this file
          // We can locate the object block roughly
          const objectBlock = content.split(`id: "${id}"`)[1] || content.split(`id: '${id}'`)[1];
          if (objectBlock) {
            // Truncate to next object or end of list
            // This is rough parsing
            bicycleContentCheck.hasFeatures = objectBlock.includes('features:');
            bicycleContentCheck.hasContent = objectBlock.includes('content:');
            bicycleContentCheck.hasFaq = objectBlock.includes('faqs:');
            bicycleContentCheck.hasCta = objectBlock.includes('cta:');
          }
        }
        if (id === 'golf-club-shipping') golfFound = true;
      }
    });

    // Filter out 'specialty-shipping' if 'pack-ship' directory covers it?
    // Wait, services.ts aggregates them. We just counted all definitions in files.
    // We need to ensure we don't double count if files are duplicated or imported weirdly.
    // But we are reading files. 'specialty.ts' might still define 'bicycle-shipping' if it wasn't deleted!
    // The user asked to "REMOVE or FIX any incorrect import".
    // If 'specialty.ts' exists and contains duplicate definitions, we should FLAG it.

    // Let's check specifically for duplicates
    const uniqueIds = new Set(serviceIds);
    if (uniqueIds.size !== serviceIds.length) {
      console.warn('WARNING: Duplicate Service IDs found!');
    }

    const report = {
      totalServices: uniqueIds.size, // Use unique count
      serviceIds: Array.from(uniqueIds),
      servicesLoaded: servicesLoaded.filter((s) => uniqueIds.has(s.id)), // simplified
      verification: {
        artworkShipping: artworkFound,
        bicycleShipping: bicycleFound,
        golfClubShipping: golfFound,
        bicycleContentCheck,
      },
      filesScanned: files.map((f) => path.basename(f)),
    };

    console.log('DIAGNOSTIC REPORT:');
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error('Diagnostic failed:', error);
  }
}

runDiagnostic();
