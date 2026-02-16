/**
 * Generates all .astro page files for the Mailbox Plus Astro migration.
 * Run once: node scripts/generate-astro-pages.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Helper: compute relative path prefix from a pages sub-path
// e.g. 'pack-ship' → '../../'  (src/pages/pack-ship/*.astro → src/layouts)
function rel(depth) {
  return '../'.repeat(depth + 1); // +1 because we're always inside src/pages/
}

// Build .astro content
function makeAstroPage({ route, component, importFile, isDefault, depth = 1 }) {
  const r = rel(depth);
  const importStatement = isDefault
    ? `import ${component} from '${r}page-components/${importFile}';`
    : `import { ${component} } from '${r}page-components/${importFile}';`;

  return `---
import Layout from '${r}layouts/Layout.astro';
import { pageMeta } from '${r}config/pageMeta';
${importStatement}

const meta = pageMeta['${route}'] ?? { title: 'Mailbox Plus Ohio', description: 'Community-focused pack & ship retail store in Concord Township, Ohio.' };
---

<Layout title={meta.title} description={meta.description} schema={meta.schema}>
    <${component} client:only="react" />
</Layout>
`;
}

// Route definitions
// { out, route, component, importFile, isDefault, depth }
const pages = [
  // ── Core service landing pages ──────────────────────────────────────────
  { out: 'pack-ship/index.astro',    route: '/pack-ship',    component: 'PackShip',    importFile: 'PackShip',    isDefault: false, depth: 1 },
  { out: 'copy-print/index.astro',   route: '/copy-print',   component: 'CopyPrint',   importFile: 'CopyPrint',   isDefault: false, depth: 1 },
  { out: 'home-business/index.astro',route: '/home-business',component: 'HomeBusiness',importFile: 'HomeBusiness',isDefault: false, depth: 1 },

  // ── Pack & Ship sub-pages ────────────────────────────────────────────────
  { out: 'pack-ship/artwork-shipping.astro',          route: '/pack-ship/artwork-shipping',          component: 'ArtworkShipping',          importFile: 'ArtworkShipping',          isDefault: false, depth: 1 },
  { out: 'pack-ship/bicycle-shipping.astro',          route: '/pack-ship/bicycle-shipping',          component: 'BicycleShipping',          importFile: 'BicycleShipping',          isDefault: false, depth: 1 },
  { out: 'pack-ship/golf-club-shipping.astro',        route: '/pack-ship/golf-club-shipping',        component: 'GolfClubShipping',        importFile: 'GolfClubShipping',        isDefault: false, depth: 1 },
  { out: 'pack-ship/fedex-shipping.astro',            route: '/pack-ship/fedex-shipping',            component: 'FedExShipping',            importFile: 'FedExShipping',            isDefault: false, depth: 1 },
  { out: 'pack-ship/ups-authorized-shipper-outlet.astro', route: '/pack-ship/ups-authorized-shipper-outlet', component: 'UPSAuthorizedShipperOutlet', importFile: 'UPSAuthorizedShipperOutlet', isDefault: false, depth: 1 },
  { out: 'pack-ship/usps-services.astro',             route: '/pack-ship/usps-services',             component: 'USPSServices',             importFile: 'USPSServices',             isDefault: false, depth: 1 },
  { out: 'pack-ship/dhl-express.astro',               route: '/pack-ship/dhl-express',               component: 'DHLExpress',               importFile: 'DHLExpress',               isDefault: false, depth: 1 },
  { out: 'pack-ship/package-drop-offs.astro',         route: '/pack-ship/package-drop-offs',         component: 'PackageDropOffs',         importFile: 'PackageDropOffs',         isDefault: false, depth: 1 },
  { out: 'pack-ship/package-receiving.astro',         route: '/pack-ship/package-receiving',         component: 'PackageReceiving',         importFile: 'PackageReceiving',         isDefault: false, depth: 1 },
  { out: 'pack-ship/custom-box-making.astro',         route: '/pack-ship/custom-box-making',         component: 'CustomBoxMaking',         importFile: 'CustomBoxMaking',         isDefault: false, depth: 1 },
  { out: 'pack-ship/professional-packing.astro',      route: '/pack-ship/professional-packing',      component: 'ProfessionalPacking',      importFile: 'ProfessionalPacking',      isDefault: false, depth: 1 },
  { out: 'pack-ship/packaging-supplies.astro',        route: '/pack-ship/packaging-supplies',        component: 'PackagingSupplies',        importFile: 'PackagingSupplies',        isDefault: false, depth: 1 },
  { out: 'pack-ship/postage-stamps.astro',            route: '/pack-ship/postage-stamps',            component: 'PostageStamps',            importFile: 'PostageStamps',            isDefault: false, depth: 1 },

  // ── Copy & Print sub-pages ───────────────────────────────────────────────
  { out: 'copy-print/business-cards.astro',     route: '/copy-print/business-cards',     component: 'BusinessCardsPage', importFile: 'BusinessCardsPage', isDefault: false, depth: 1 },
  { out: 'copy-print/flyers-brochures.astro',   route: '/copy-print/flyers-brochures',   component: 'FlyersBrochures',   importFile: 'FlyersBrochures',   isDefault: false, depth: 1 },
  { out: 'copy-print/posters-printing.astro',   route: '/copy-print/posters-printing',   component: 'PostersPrinting',   importFile: 'PostersPrinting',   isDefault: false, depth: 1 },
  { out: 'copy-print/postcard-printing.astro',  route: '/copy-print/postcard-printing',  component: 'PostcardPrinting',  importFile: 'PostcardPrinting',  isDefault: false, depth: 1 },
  { out: 'copy-print/document-printing.astro',  route: '/copy-print/document-printing',  component: 'DocumentPrinting',  importFile: 'DocumentPrinting',  isDefault: false, depth: 1 },
  { out: 'copy-print/graphic-design.astro',     route: '/copy-print/graphic-design',     component: 'GraphicDesign',     importFile: 'GraphicDesign',     isDefault: false, depth: 1 },
  { out: 'copy-print/copies.astro',             route: '/copy-print/copies',             component: 'Copies',            importFile: 'Copies',            isDefault: false, depth: 1 },

  // ── Home & Business sub-pages ────────────────────────────────────────────
  { out: 'home-business/mailbox-rental.astro',         route: '/home-business/mailbox-rental',         component: 'MailboxRentalPage',    importFile: 'MailboxRentalPage',    isDefault: false, depth: 1 },
  { out: 'home-business/digital-mailbox-rental.astro', route: '/home-business/digital-mailbox-rental', component: 'DigitalMailboxRental', importFile: 'DigitalMailboxRental', isDefault: false, depth: 1 },
  { out: 'home-business/every-door-direct-mail.astro', route: '/home-business/every-door-direct-mail', component: 'EveryDoorDirectMail', importFile: 'EveryDoorDirectMail', isDefault: false, depth: 1 },
  { out: 'home-business/shredding.astro',              route: '/home-business/shredding',              component: 'Shredding',            importFile: 'Shredding',            isDefault: false, depth: 1 },
  { out: 'home-business/document-scanning.astro',      route: '/home-business/document-scanning',      component: 'DocumentScanning',    importFile: 'DocumentScanning',    isDefault: false, depth: 1 },
  { out: 'home-business/fax-services.astro',           route: '/home-business/fax-services',           component: 'FaxServices',          importFile: 'FaxServices',          isDefault: false, depth: 1 },
  { out: 'home-business/notary-services.astro',        route: '/home-business/notary-services',        component: 'NotaryServices',       importFile: 'NotaryServices',       isDefault: false, depth: 1 },

  // ── Specialty ────────────────────────────────────────────────────────────
  { out: 'specialty/digital-fingerprinting.astro', route: '/specialty/digital-fingerprinting', component: 'DigitalFingerprinting', importFile: 'DigitalFingerprinting', isDefault: false, depth: 1 },
  { out: 'specialty/insurance.astro',              route: '/specialty/insurance',              component: 'Insurance',             importFile: 'Insurance',             isDefault: false, depth: 1 },

  // ── Standalone top-level pages ───────────────────────────────────────────
  { out: 'about-us.astro',     route: '/about-us',     component: 'AboutUs',     importFile: 'AboutUs',     isDefault: false, depth: 0 },
  { out: 'contact-us.astro',   route: '/contact-us',   component: 'ContactUs',   importFile: 'ContactUs',   isDefault: false, depth: 0 },
  { out: 'services.astro',     route: '/services',     component: 'Services',    importFile: 'Services',    isDefault: false, depth: 0 },
  { out: 'tracking.astro',     route: '/tracking',     component: 'Tracking',    importFile: 'Tracking',    isDefault: false, depth: 0 },
  { out: 'privacy.astro',      route: '/privacy',      component: 'Privacy',     importFile: 'Privacy',     isDefault: false, depth: 0 },
  { out: 'terms.astro',        route: '/terms',        component: 'Terms',       importFile: 'Terms',       isDefault: false, depth: 0 },
  { out: 'fedex-easy-returns.astro',    route: '/fedex-easy-returns',    component: 'FedExEasyReturns',    importFile: 'fedex-easy-returns',    isDefault: false, depth: 0 },
  { out: 'nuuly-returns.astro',         route: '/nuuly-returns',         component: 'NuulyReturns',        importFile: 'NuulyReturns',          isDefault: false, depth: 0 },
  { out: 'amazon-returns.astro',        route: '/amazon-returns',        component: 'AmazonReturnGuide',   importFile: 'AmazonReturnGuide',     isDefault: false, depth: 0 },
  { out: 'shipping-partners.astro',     route: '/shipping-partners',     component: 'ShippingPartners',    importFile: 'ShippingPartners',      isDefault: true,  depth: 0 },
  { out: 'pickup-hours.astro',          route: '/pickup-hours',          component: 'PickupHours',         importFile: 'PickupHours',           isDefault: true,  depth: 0 },
  { out: 'ask-mailbox-plus.astro',      route: '/ask-mailbox-plus',      component: 'AskMailboxPlus',      importFile: 'ask-mailbox-plus',      isDefault: true,  depth: 0 },

  // ── SEO landing pages (default exports) ─────────────────────────────────
  { out: 'ups-store-alternative-concord-township.astro',          route: '/ups-store-alternative-concord-township',          component: 'UPSStoreAlternativePage',      importFile: 'ups-store-alternative-concord-township',          isDefault: true, depth: 0 },
  { out: 'mail-boxes-etc-alternative-concord-township.astro',     route: '/mail-boxes-etc-alternative-concord-township',     component: 'MailBoxesEtcAlternativePage',  importFile: 'mail-boxes-etc-alternative-concord-township',     isDefault: true, depth: 0 },
  { out: 'fedex-office-alternative-concord-township.astro',       route: '/fedex-office-alternative-concord-township',       component: 'FedExOfficeAlternativePage',   importFile: 'fedex-office-alternative-concord-township',       isDefault: true, depth: 0 },
  { out: 'staples-printing-alternative-concord-township.astro',   route: '/staples-printing-alternative-concord-township',   component: 'StaplesAlternativePage',       importFile: 'staples-printing-alternative-concord-township',   isDefault: true, depth: 0 },
  { out: 'office-depot-alternative-concord-township.astro',       route: '/office-depot-alternative-concord-township',       component: 'OfficeDepotAlternativePage',   importFile: 'office-depot-alternative-concord-township',       isDefault: true, depth: 0 },
  { out: 'usps-drop-off-alternative-concord-township.astro',      route: '/usps-drop-off-alternative-concord-township',      component: 'USPSDropOffAlternativePage',   importFile: 'usps-drop-off-alternative-concord-township',      isDefault: true, depth: 0 },
  { out: 'post-office-alternative-concord-township.astro',        route: '/post-office-alternative-concord-township',        component: 'PostOfficeAlternativePage',    importFile: 'post-office-alternative-concord-township',        isDefault: true, depth: 0 },
  { out: 'usps-package-help-concord-township.astro',              route: '/usps-package-help-concord-township',              component: 'USPSPackageHelpPage',          importFile: 'usps-package-help-concord-township',              isDefault: true, depth: 0 },
  { out: 'shipping-center-concord-township.astro',                route: '/shipping-center-concord-township',                component: 'ShippingCenterPage',           importFile: 'shipping-center-concord-township',                isDefault: true, depth: 0 },
  { out: 'pack-and-ship-services-concord-township.astro',         route: '/pack-and-ship-services-concord-township',         component: 'PackAndShipServicesPage',      importFile: 'pack-and-ship-services-concord-township',         isDefault: true, depth: 0 },
  { out: 'ups-fedex-usps-dhl-shipping-concord-township.astro',    route: '/ups-fedex-usps-dhl-shipping-concord-township',    component: 'MultiCarrierShippingPage',     importFile: 'ups-fedex-usps-dhl-shipping-concord-township',    isDefault: true, depth: 0 },
  { out: 'small-business-shipping-concord-township.astro',        route: '/small-business-shipping-concord-township',        component: 'SmallBusinessShippingPage',    importFile: 'small-business-shipping-concord-township',        isDefault: true, depth: 0 },
  { out: 'amazon-returns-drop-off-concord-township.astro',        route: '/amazon-returns-drop-off-concord-township',        component: 'AmazonReturnsPage',            importFile: 'amazon-returns-drop-off-concord-township',        isDefault: true, depth: 0 },
  { out: 'ups-drop-off-alternative-concord-township.astro',       route: '/ups-drop-off-alternative-concord-township',       component: 'UPSDropOffAlternativePage',    importFile: 'ups-drop-off-alternative-concord-township',       isDefault: true, depth: 0 },
  { out: 'printing-services-concord-township.astro',              route: '/printing-services-concord-township',              component: 'PrintingServicesPage',         importFile: 'printing-services-concord-township',              isDefault: true, depth: 0 },
  { out: 'business-services-concord-township.astro',              route: '/business-services-concord-township',              component: 'BusinessServicesPage',         importFile: 'business-services-concord-township',              isDefault: true, depth: 0 },
  { out: 'document-services-concord-township.astro',              route: '/document-services-concord-township',              component: 'DocumentServicesPage',         importFile: 'document-services-concord-township',              isDefault: true, depth: 0 },
  { out: 'private-mailbox-rental-concord-township.astro',         route: '/private-mailbox-rental-concord-township',         component: 'PrivateMailboxRentalPage',     importFile: 'private-mailbox-rental-concord-township',         isDefault: true, depth: 0 },
  { out: 'virtual-mailbox-concord-township.astro',                route: '/virtual-mailbox-concord-township',                component: 'VirtualMailboxPage',           importFile: 'virtual-mailbox-concord-township',                isDefault: true, depth: 0 },
  { out: 'mail-forwarding-concord-township.astro',                route: '/mail-forwarding-concord-township',                component: 'MailForwardingPage',           importFile: 'mail-forwarding-concord-township',                isDefault: true, depth: 0 },

  // ── Service areas (index only — [slug].astro handled separately) ─────────
  { out: 'service-area/index.astro', route: '/service-area', component: 'ServiceAreaIndex', importFile: 'ServiceAreaIndex', isDefault: false, depth: 1 },
];

let created = 0;
for (const page of pages) {
  const outPath = path.join(ROOT, 'src/pages', page.out);
  const dir = path.dirname(outPath);
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(outPath)) {
    fs.writeFileSync(outPath, makeAstroPage(page));
    created++;
    console.log(`  ✓ ${page.out}`);
  } else {
    console.log(`  – ${page.out} (already exists, skipped)`);
  }
}

console.log(`\nDone. Created ${created} files.`);
