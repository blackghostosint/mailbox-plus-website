/**
 * Generates individual .astro page files for all micro-problem routes.
 * Run once: node scripts/generate-micro-problem-pages.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// All micro-problem slugs (leading slash stripped → becomes filename)
const slugs = [
    '/return-without-original-box',
    '/print-return-label-without-printer',
    '/print-amazon-return-label',
    '/package-a-return-so-its-accepted-by-the-carrier',
    '/ups-drop-off-near-concord-township-not-sure-if-its-packed-right',
    '/fedex-drop-off-in-concord-township-have-label-need-packaging',
    '/usps-drop-off-in-concord-township-label-printing-and-packaging-help',
    '/drop-off-a-prepaid-label-from-your-phone',
    '/ship-return-strict-size-weight-limits',
    '/fix-a-return-that-was-rejected-due-to-packaging-issues-in-concord-township',
    '/ship-a-fragile-item-safely-in-concord-township-glass-ceramics-electronics',
    '/ship-an-odd-shaped-or-oversized-item-in-concord-township-guitars-lamps-sports-equipment',
    '/ship-a-heavy-package-in-concord-township-over-50-lbs-wont-get-rejected',
    '/ship-electronics-safely-in-concord-township-phones-laptops-tablets-computers',
    '/ship-artwork-framed-items-or-collectibles-safely-in-concord-township',
    '/ship-documents-securely-and-flat-in-concord-township-contracts-certificates-legal-papers',
    '/ship-a-gift-without-the-receipt-or-invoice-in-concord-township',
    '/unsure-of-carrier-rules',
    '/ship-an-item-that-needs-extra-protection-or-padding-in-concord-township',
    '/ship-a-package-when-youre-short-on-time-in-concord-township',
    '/ship-with-guaranteed-proof-and-tracking-concord-township',
    '/repackage-a-damaged-or-torn-shipping-box-in-concord-township',
    '/package-multiple-items-into-one-shipment-in-concord-township',
    '/ship-something-with-no-original-packaging-in-concord-township',
    '/print-and-attach-a-shipping-label-correctly-in-concord-township',
    '/get-help-choosing-the-right-box-for-shipping-in-concord-township',
];

let created = 0;
for (const slug of slugs) {
    const filename = slug.slice(1); // strip leading /
    const outPath = path.join(ROOT, 'src/pages', `${filename}.astro`);

    if (fs.existsSync(outPath)) {
        console.log(`  – ${filename}.astro (already exists, skipped)`);
        continue;
    }

    const content = `---
import Layout from '../layouts/Layout.astro';
import { pageMeta } from '../config/pageMeta';
import { MicroProblemContent } from '../page-components/micro/MicroProblemPage';

const meta = pageMeta['${slug}'] ?? { title: 'Mailbox Plus Ohio', description: 'Community-focused pack & ship retail store in Concord Township, Ohio.' };
---

<Layout title={meta.title} description={meta.description} schema={meta.schema}>
    <MicroProblemContent slug="${slug}" client:only="react" />
</Layout>
`;

    fs.writeFileSync(outPath, content);
    created++;
    console.log(`  ✓ ${filename}.astro`);
}

console.log(`\nDone. Created ${created} micro-problem pages.`);
