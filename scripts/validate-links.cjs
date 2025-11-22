const fs = require('fs');
const path = require('path');

// Load data files
const siteStructure = require('../src/data/siteStructure.json');
const internalLinks = require('../src/data/internalLinks.json');
const anchorText = require('../src/data/anchorText.json');
const localPages = require('../src/data/localPages.json');

console.log('Validating Internal Linking Structure...\n');

let errors = [];
let warnings = [];

// 1. Collect all pages
const allPages = new Set();
allPages.add(siteStructure.homepage.url);

siteStructure.pillars.forEach(p => {
    allPages.add(p.url);
    p.children.forEach(c => allPages.add(c.url));
});
siteStructure.subSupporting.forEach(s => allPages.add(s.url));
localPages.forEach(l => allPages.add(l.url));

console.log(`Total Pages: ${allPages.size}`);

// 2. Check for Orphans (Inbound Links)
const inboundLinks = {};
allPages.forEach(url => inboundLinks[url] = 0);

// Simulate links from rules
// Parent -> Child
siteStructure.pillars.forEach(p => {
    p.children.forEach(c => {
        inboundLinks[c.url]++;
    });
});

// Child -> Parent (simulated as all children link back)
siteStructure.pillars.forEach(p => {
    p.children.forEach(c => {
        inboundLinks[p.url]++;
    });
});

// Cross Links
Object.keys(internalLinks).forEach(key => {
    const linkData = internalLinks[key];
    if (linkData.related) {
        linkData.related.forEach(relatedId => {
            // Find URL for ID
            let targetUrl = null;
             siteStructure.pillars.forEach(p => {
                const child = p.children.find(c => c.id === relatedId);
                if (child) targetUrl = child.url;
            });
            if (!targetUrl && siteStructure.pillars.find(p => p.id === relatedId)) {
                targetUrl = siteStructure.pillars.find(p => p.id === relatedId).url;
            }

            if (targetUrl) inboundLinks[targetUrl]++;
        });
    }
});

// Local Pages linking to priority services
localPages.forEach(local => {
    local.priorityServices.forEach(serviceId => {
         let targetUrl = null;
             siteStructure.pillars.forEach(p => {
                if (p.id === serviceId) targetUrl = p.url;
                const child = p.children.find(c => c.id === serviceId);
                if (child) targetUrl = child.url;
            });
        if (targetUrl) inboundLinks[targetUrl]++;
    });
    // Assume homepage links to all local pages via footer/sitemap
    inboundLinks[local.url]++;
});


// Check for 0 inbound links
Object.keys(inboundLinks).forEach(url => {
    if (inboundLinks[url] === 0 && url !== '/') {
        errors.push(`Orphan Page Detected: ${url}`);
    }
});

// 3. Check Anchor Text Diversity
Object.keys(anchorText).forEach(key => {
    const anchors = anchorText[key];
    if (!anchors.exact || anchors.exact.length === 0) {
        warnings.push(`Missing Exact Match anchors for ${key}`);
    }
    if (!anchors.lsi || anchors.lsi.length === 0) {
        warnings.push(`Missing LSI anchors for ${key}`);
    }
});

// 4. Report
console.log('\n--- Validation Report ---');
if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach(e => console.error(`[X] ${e}`));
} else {
    console.log('No critical errors found.');
}

if (warnings.length > 0) {
    console.log('\nWarnings:');
    warnings.forEach(w => console.warn(`[!] ${w}`));
} else {
    console.log('No warnings found.');
}

console.log('\nValidation Complete.');