import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig, phoneFormatted } from '../config/siteConfig';
import { privateMailboxRentalFaqs } from '../config/faqs/home-business/privateMailboxRentalFaqs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');

describe('facts.json synchronization with siteConfig.ts', () => {
  it('content/facts.json matches siteConfig.ts contact and address details', () => {
    const factsPath = path.join(REPO_ROOT, 'content/facts.json');
    expect(fs.existsSync(factsPath)).toBe(true);

    const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

    expect(facts.address.street).toBe(siteConfig.contact.address.street);
    expect(facts.address.city).toBe(siteConfig.contact.address.city);
    expect(facts.address.state).toBe(siteConfig.contact.address.state);
    expect(facts.address.zip).toBe(siteConfig.contact.address.zip);

    expect(facts.phone_alt).toBe(siteConfig.contact.phone);
    expect(facts.phone).toBe(phoneFormatted);
    expect(facts.email).toBe(siteConfig.contact.email);
  });

  it('privateMailboxRentalFaqs formats address without duplicate street suffixes', () => {
    const addressFaq = privateMailboxRentalFaqs.find((faq) =>
      faq.question.includes('address look like')
    );
    expect(addressFaq).toBeDefined();
    expect(addressFaq?.answer).not.toContain('Drive Dr');
    expect(addressFaq?.answer).toContain('7554 Fredle Drive #234');
  });
});
