import { describe, it, expect } from 'vitest';
import {
  extractOpenApiSpecsFromFunctions,
  buildOpenApiSpec,
  runGenerateApiSpec,
} from '../generate-api-spec.ts';

describe('generate-api-spec', () => {
  it('extracts OpenAPI specifications from netlify/functions JSDoc comments', () => {
    const specs = extractOpenApiSpecsFromFunctions();

    const expectedPaths = [
      '/.netlify/functions/create-checkout',
      '/.netlify/functions/csp-report',
      '/.netlify/functions/health',
      '/api/reviews',
      '/.netlify/functions/sendEmail',
      '/.netlify/functions/verify-session',
    ];

    for (const ep of expectedPaths) {
      expect(specs).toHaveProperty(ep);
    }
  });

  it('builds a complete OpenAPI 3.0 document covering all required endpoints', () => {
    const doc = buildOpenApiSpec();

    expect(doc.openapi).toBe('3.0.3');
    expect(doc.info.title).toBe('Mailbox Plus Serverless API');
    expect(Object.keys(doc.paths)).toHaveLength(6);
    expect(doc.paths['/.netlify/functions/create-checkout'].post.summary).toBe(
      'Create Stripe Checkout Session'
    );
  });

  it('passes check mode when docs/openapi.json is synchronized', () => {
    const success = runGenerateApiSpec({ check: true });
    expect(success).toBe(true);
  });
});
