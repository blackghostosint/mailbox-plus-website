import { describe, it, expect } from 'vitest';
import { flattenFaqs } from './faqUtils';
import type { FAQ } from '../types/faq';

describe('faqUtils', () => {
  describe('flattenFaqs', () => {
    const faq1: FAQ = {
      id: 'faq-1',
      question: 'What are your hours of operation?',
      answer: 'We are open Monday through Friday from 8am to 6pm.',
      category: 'general',
    };

    const faq2: FAQ = {
      id: 'faq-2',
      question: 'Do you offer mailbox rental?',
      answer: 'Yes, we offer private digital and physical mailbox rentals.',
      category: 'mailboxes',
    };

    const faq3: FAQ = {
      id: 'faq-3',
      question: 'How do package notifications work?',
      answer: 'You will receive an email or SMS as soon as a package arrives.',
      category: 'mailboxes',
    };

    const faq4: FAQ = {
      id: 'faq-4',
      question: 'What shipping carriers do you accept?',
      answer: 'We accept packages from UPS, FedEx, USPS, and DHL.',
      category: 'shipping',
    };

    it('returns an empty array when given an empty object', () => {
      const result = flattenFaqs({});
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('flattens a flat single-category object containing an array of FAQs', () => {
      const input = {
        general: [faq1, faq2],
      };
      const result = flattenFaqs(input);
      expect(result).toHaveLength(2);
      expect(result).toEqual([faq1, faq2]);
    });

    it('flattens a multi-level deeply nested category structure', () => {
      const input = {
        services: {
          mailboxes: [faq2, faq3],
          shipping: {
            domestic: [faq4],
          },
        },
        general: [faq1],
      };
      const result = flattenFaqs(input);
      expect(result).toHaveLength(4);
      expect(result).toEqual([faq2, faq3, faq4, faq1]);
    });

    it('handles objects with empty FAQ arrays returning an empty array', () => {
      const input = {
        emptyCategory: [],
        nestedEmpty: {
          subCategory: [],
        },
      };
      const result = flattenFaqs(input);
      expect(result).toEqual([]);
    });

    it('safely ignores null, undefined, string, number, and boolean primitive values alongside arrays', () => {
      const input = {
        title: 'Main FAQ Section',
        count: 42,
        isPublished: true,
        metadata: null,
        description: undefined,
        general: [faq1],
        nested: {
          author: 'Admin',
          version: 2,
          active: false,
          missing: null,
          items: [faq2],
        },
      };
      const result = flattenFaqs(input);
      expect(result).toHaveLength(2);
      expect(result).toEqual([faq1, faq2]);
    });

    it('excludes inherited prototype properties using hasOwnProperty verification', () => {
      const prototypeObj = {
        inheritedFaqs: [faq3],
      };
      const input = Object.create(prototypeObj);
      input.ownCategory = [faq1];

      const result = flattenFaqs(input);
      expect(result).toHaveLength(1);
      expect(result).toEqual([faq1]);
    });
  });
});
