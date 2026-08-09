// vault-sync extractor — run as: npx vitest run scripts/vault-extract.test.ts
// Writes /tmp/vault-data.json with all website config data for vault sync.
import { describe, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { siteConfig } from '../config/siteConfig';
import { coreServices } from '../config/services/core';
import { packShipServices } from '../config/services/pack-ship';
import { copyPrintServices } from '../config/services/copy-print';
import { mailboxRentalServices } from '../config/services/mailbox-rentals';
import { documentServices } from '../config/services/document-services';
import { additionalServices } from '../config/services/additional-services';
import { serviceAreas } from '../config/serviceAreas';
import { primaryLocations, secondaryLocations } from '../config/locations';
import { categories } from '../config/categories';
import { generalShippingFaqs, generalCopyPrintFaqs, generalHomeBusinessFaqs } from '../config/faqs';

async function collectFaqs(): Promise<Record<string, unknown[]>> {
  const collected: Record<string, unknown[]> = {};
  const dirs = ['pack-ship', 'copy-print', 'home-business', 'specialty', 'notary'];
  for (const dir of dirs) {
    const index = await import(`../config/faqs/${dir}/index.ts`);
    for (const [key, value] of Object.entries(index)) {
      if (Array.isArray(value)) {
        collected[`${dir}:${key}`] = value as unknown[];
      }
    }
  }
  return collected;
}

describe('vault-extract', () => {
  it('dumps all configs to /tmp/vault-data.json', async () => {
    const out = {
      generatedAt: new Date().toISOString(),
      siteConfig,
      categories,
      services: {
        core: coreServices,
        'pack-ship': packShipServices,
        'copy-print': copyPrintServices,
        'mailbox-rentals': mailboxRentalServices,
        'document-services': documentServices,
        additional: additionalServices,
      },
      serviceAreas,
      locations: { primary: primaryLocations, secondary: secondaryLocations },
      faqs: {
        generalShipping: generalShippingFaqs,
        generalCopyPrint: generalCopyPrintFaqs,
        generalHomeBusiness: generalHomeBusinessFaqs,
        categories: await collectFaqs(),
      },
    };
    writeFileSync('/tmp/vault-data.json', JSON.stringify(out, null, 1));
    // sanity: print counts
    const faqCount = (arr: unknown[]) => arr.length;
    console.log(
      'SERVICES:',
      Object.fromEntries(Object.entries(out.services).map(([k, v]) => [k, (v as unknown[]).length]))
    );
    console.log('SERVICE AREAS:', out.serviceAreas.length);
    console.log('LOCATIONS:', out.locations.primary.length, '/', out.locations.secondary.length);
    console.log(
      'GENERAL FAQS:',
      faqCount(out.faqs.generalShipping) +
        faqCount(out.faqs.generalCopyPrint) +
        faqCount(out.faqs.generalHomeBusiness)
    );
    let catFaq = 0;
    for (const v of Object.values(out.faqs.categories)) catFaq += (v as unknown[]).length;
    console.log('CATEGORY FAQS:', catFaq);
    console.log(
      'TOTAL FAQS:',
      faqCount(out.faqs.generalShipping) +
        faqCount(out.faqs.generalCopyPrint) +
        faqCount(out.faqs.generalHomeBusiness) +
        catFaq
    );
  }, 60000);
});
