import { describe, it, expect } from 'vitest';
import { services } from '../services';

describe('services configuration registry', () => {
  it('exports a non-empty array of service configurations', () => {
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(20);
  });

  describe('Structural integrity & required attributes', () => {
    it('has all required attributes populated with non-empty strings for every service', () => {
      services.forEach((service) => {
        expect(service.id, `Service ID missing or invalid`).toBeTruthy();
        expect(typeof service.id).toBe('string');
        expect(service.id.trim()).toBe(service.id);

        expect(
          service.serviceName,
          `serviceName missing for service ID '${service.id}'`
        ).toBeTruthy();
        expect(typeof service.serviceName).toBe('string');
        expect(service.serviceName.trim().length).toBeGreaterThan(0);

        expect(service.category, `category missing for service ID '${service.id}'`).toBeTruthy();
        expect(typeof service.category).toBe('string');

        expect(service.slug, `slug missing for service ID '${service.id}'`).toBeTruthy();
        expect(typeof service.slug).toBe('string');

        expect(service.city, `city missing for service ID '${service.id}'`).toBeTruthy();
        expect(typeof service.city).toBe('string');
        expect(service.city.trim().length).toBeGreaterThan(0);

        expect(service.pageTitle, `pageTitle missing for service ID '${service.id}'`).toBeTruthy();
        expect(typeof service.pageTitle).toBe('string');
        expect(service.pageTitle.trim().length).toBeGreaterThan(0);

        expect(
          service.metaDescription,
          `metaDescription missing for service ID '${service.id}'`
        ).toBeTruthy();
        expect(typeof service.metaDescription).toBe('string');
        expect(service.metaDescription.trim().length).toBeGreaterThan(0);

        expect(service.heroTitle, `heroTitle missing for service ID '${service.id}'`).toBeTruthy();
        expect(typeof service.heroTitle).toBe('string');
        expect(service.heroTitle.trim().length).toBeGreaterThan(0);

        expect(
          service.heroSubtitle,
          `heroSubtitle missing for service ID '${service.id}'`
        ).toBeTruthy();
        expect(typeof service.heroSubtitle).toBe('string');
        expect(service.heroSubtitle.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Uniqueness guarantees', () => {
    it('ensures all service IDs are unique', () => {
      const seenIds = new Set<string>();
      const duplicates: string[] = [];

      services.forEach((service) => {
        if (seenIds.has(service.id)) {
          duplicates.push(service.id);
        }
        seenIds.add(service.id);
      });

      expect(duplicates, `Duplicate service IDs found: ${duplicates.join(', ')}`).toEqual([]);
    });

    it('ensures all service route slugs are unique', () => {
      const seenSlugs = new Set<string>();
      const duplicates: string[] = [];

      services.forEach((service) => {
        if (seenSlugs.has(service.slug)) {
          duplicates.push(service.slug);
        }
        seenSlugs.add(service.slug);
      });

      expect(duplicates, `Duplicate service slugs found: ${duplicates.join(', ')}`).toEqual([]);
    });
  });

  describe('Route slug rules', () => {
    it('verifies route slug formatting rules for all services', () => {
      services.forEach((service) => {
        expect(
          service.slug.startsWith('/'),
          `Slug '${service.slug}' for service '${service.id}' must start with a forward slash '/'`
        ).toBe(true);

        expect(
          service.slug.trim(),
          `Slug '${service.slug}' for service '${service.id}' must not contain leading/trailing whitespace`
        ).toBe(service.slug);

        if (service.slug.length > 1) {
          expect(
            service.slug.endsWith('/'),
            `Slug '${service.slug}' for service '${service.id}' must not contain a trailing slash`
          ).toBe(false);
        }
      });
    });
  });

  describe('CTA button links validation', () => {
    it('verifies CTA target links are valid relative paths or secure absolute URLs', () => {
      services.forEach((service) => {
        if (service.cta) {
          expect(service.cta.title, `CTA title missing in service '${service.id}'`).toBeTruthy();
          expect(
            service.cta.buttonText,
            `CTA buttonText missing in service '${service.id}'`
          ).toBeTruthy();
          expect(
            service.cta.buttonLink,
            `CTA buttonLink missing in service '${service.id}'`
          ).toBeTruthy();

          const isRelative = service.cta.buttonLink.startsWith('/');
          const isSecureExternal =
            service.cta.buttonLink.startsWith('https://') ||
            service.cta.buttonLink.startsWith('tel:') ||
            service.cta.buttonLink.startsWith('mailto:');

          expect(
            isRelative || isSecureExternal,
            `CTA buttonLink '${service.cta.buttonLink}' in service '${service.id}' must be a relative path starting with '/' or secure URL starting with 'https://', 'tel:', or 'mailto:'`
          ).toBe(true);

          if (service.cta.extraButtons) {
            service.cta.extraButtons.forEach((extraBtn, idx) => {
              expect(
                extraBtn.text,
                `Extra button text missing at index ${idx} in service '${service.id}'`
              ).toBeTruthy();
              const isExtraRelative = extraBtn.link.startsWith('/');
              const isExtraExternal =
                extraBtn.link.startsWith('https://') ||
                extraBtn.link.startsWith('http://') ||
                extraBtn.link.startsWith('tel:') ||
                extraBtn.link.startsWith('mailto:');

              expect(
                isExtraRelative || isExtraExternal,
                `Extra button link '${extraBtn.link}' in service '${service.id}' must be relative or absolute URL`
              ).toBe(true);
            });
          }

          if (service.cta.finePrint?.link) {
            const isFinePrintRelative = service.cta.finePrint.link.startsWith('/');
            const isFinePrintExternal =
              service.cta.finePrint.link.startsWith('https://') ||
              service.cta.finePrint.link.startsWith('http://') ||
              service.cta.finePrint.link.startsWith('tel:') ||
              service.cta.finePrint.link.startsWith('mailto:');

            expect(
              isFinePrintRelative || isFinePrintExternal,
              `Fine print link '${service.cta.finePrint.link}' in service '${service.id}' must be relative or valid link`
            ).toBe(true);
          }
        }
      });
    });
  });

  describe('FAQ schema validation', () => {
    it('verifies FAQ structures contain valid question and answer strings', () => {
      services.forEach((service) => {
        if (service.faqs) {
          expect(
            Array.isArray(service.faqs),
            `faqs property in service '${service.id}' must be an array`
          ).toBe(true);

          service.faqs.forEach((faq, idx) => {
            expect(
              faq.question,
              `FAQ item ${idx} in service '${service.id}' missing question`
            ).toBeTruthy();
            expect(
              typeof faq.question,
              `FAQ item ${idx} question in service '${service.id}' must be string`
            ).toBe('string');
            expect(faq.question.trim().length).toBeGreaterThan(0);

            expect(
              faq.answer,
              `FAQ item ${idx} in service '${service.id}' missing answer`
            ).toBeTruthy();
            expect(
              typeof faq.answer,
              `FAQ item ${idx} answer in service '${service.id}' must be string`
            ).toBe('string');
            expect(faq.answer.trim().length).toBeGreaterThan(0);
          });
        }
      });
    });
  });

  describe('Optional service sub-schemas (content, features, offers, refLink)', () => {
    it('verifies content items if present', () => {
      services.forEach((service) => {
        if (service.content) {
          expect(Array.isArray(service.content)).toBe(true);
          service.content.forEach((block, idx) => {
            expect(
              block.heading,
              `Content block ${idx} heading missing in '${service.id}'`
            ).toBeTruthy();
            expect(block.body, `Content block ${idx} body missing in '${service.id}'`).toBeTruthy();
          });
        }
      });
    });

    it('verifies features items if present', () => {
      services.forEach((service) => {
        if (service.features) {
          expect(Array.isArray(service.features)).toBe(true);
          service.features.forEach((feat, idx) => {
            expect(feat.title, `Feature ${idx} title missing in '${service.id}'`).toBeTruthy();
            expect(
              feat.description,
              `Feature ${idx} description missing in '${service.id}'`
            ).toBeTruthy();
          });
        }
      });
    });

    it('verifies offers items if present', () => {
      services.forEach((service) => {
        if (service.offers) {
          expect(Array.isArray(service.offers)).toBe(true);
          service.offers.forEach((offer, idx) => {
            expect(offer.name, `Offer ${idx} name missing in '${service.id}'`).toBeTruthy();
            expect(offer.price, `Offer ${idx} price missing in '${service.id}'`).toBeTruthy();
          });
        }
      });
    });

    it('verifies refLink if present', () => {
      services.forEach((service) => {
        if (service.refLink) {
          expect(service.refLink.url, `refLink url missing in '${service.id}'`).toBeTruthy();
          expect(service.refLink.label, `refLink label missing in '${service.id}'`).toBeTruthy();
          const isValid =
            service.refLink.url.startsWith('/') ||
            service.refLink.url.startsWith('https://') ||
            service.refLink.url.startsWith('http://');
          expect(
            isValid,
            `refLink url '${service.refLink.url}' in '${service.id}' must be relative or absolute URL`
          ).toBe(true);
        }
      });
    });
  });
});
