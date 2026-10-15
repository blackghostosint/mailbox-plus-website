import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateKb } from '../validate-kb.ts';

describe('validate-kb schema strictness', () => {
  let tempFilePath: string;
  let tempMetaPath: string;

  const validEntry = {
    id: 'kb-test-001',
    intent: 'test_intent',
    title: 'Test Title',
    questionVariants: ['How do I test?'],
    answer: 'This is a test answer.',
    confidence: {
      minimumSimilarity: 0.8,
      requiresExactMatch: false,
    },
    sources: [
      {
        type: 'documentation',
        url: 'https://mailboxplusohio.com/test',
        lastVerified: '2026-01-01',
      },
    ],
    constraints: {
      requiresHuman: false,
      disallowedFollowups: [],
    },
    escalation: {
      enabled: false,
      message: 'Escalation disabled',
    },
    tags: ['test'],
    searchText: 'test search text',
  };

  const validMeta = {
    site: 'mailboxplusohio.com',
    lastBuiltAt: '2026-10-15T14:18:53.000Z',
    contentVersion: '0.0.0',
    embeddingModel: 'text-embedding-004',
    allowedIntents: ['faq', 'service_info', 'micro_problem', 'hours_location', 'policies'],
    fallbackResponse:
      "I don't have that information. Please contact the store directly or visit us in person.",
  };

  beforeEach(() => {
    tempFilePath = path.join(
      os.tmpdir(),
      `kb-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
    tempMetaPath = path.join(
      os.tmpdir(),
      `kb-meta-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    if (fs.existsSync(tempMetaPath)) {
      fs.unlinkSync(tempMetaPath);
    }
  });

  it('passes validation for valid KB entries', () => {
    const validData = { entries: [validEntry] };
    fs.writeFileSync(tempFilePath, JSON.stringify(validData), 'utf-8');

    const result = validateKb(tempFilePath);
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.entryCount).toBe(1);
  });

  it('rejects KB entry containing unknown/unexpected fields', () => {
    const dataWithExtraField = {
      entries: [
        {
          ...validEntry,
          unexpected: 'extra_value',
        },
      ],
    };
    fs.writeFileSync(tempFilePath, JSON.stringify(dataWithExtraField), 'utf-8');

    const result = validateKb(tempFilePath);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((err) => err.includes('unexpected'))).toBe(true);
  });

  it('rejects nested objects containing unknown/unexpected fields', () => {
    const dataWithExtraNestedField = {
      entries: [
        {
          ...validEntry,
          confidence: {
            ...validEntry.confidence,
            unexpectedConfidenceProp: true,
          },
        },
      ],
    };
    fs.writeFileSync(tempFilePath, JSON.stringify(dataWithExtraNestedField), 'utf-8');

    const result = validateKb(tempFilePath);
    expect(result.success).toBe(false);
    expect(result.errors.some((err) => err.includes('unexpectedConfidenceProp'))).toBe(true);
  });

  it('rejects top-level root object containing unknown fields', () => {
    const dataWithExtraRootField = {
      entries: [validEntry],
      unexpectedRootProp: 'invalid',
    };
    fs.writeFileSync(tempFilePath, JSON.stringify(dataWithExtraRootField), 'utf-8');

    const result = validateKb(tempFilePath);
    expect(result.success).toBe(false);
    expect(result.errors.some((err) => err.includes('unexpectedRootProp'))).toBe(true);
  });

  it('rejects duplicate entry IDs', () => {
    const duplicateData = {
      entries: [validEntry, { ...validEntry }],
    };
    fs.writeFileSync(tempFilePath, JSON.stringify(duplicateData), 'utf-8');

    const result = validateKb(tempFilePath);
    expect(result.success).toBe(false);
    expect(result.errors.some((err) => err.includes("Duplicate entry ID 'kb-test-001'"))).toBe(
      true
    );
  });

  it('validates actual repo knowledge base dataset successfully', () => {
    const result = validateKb();
    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.entryCount).toBeGreaterThan(0);
  });

  describe('kb.meta.json manifest validation', () => {
    it('passes validation when valid metadata manifest is provided', () => {
      fs.writeFileSync(tempFilePath, JSON.stringify({ entries: [validEntry] }), 'utf-8');
      fs.writeFileSync(tempMetaPath, JSON.stringify(validMeta), 'utf-8');

      const result = validateKb(tempFilePath, tempMetaPath);
      expect(result.success).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('rejects metadata manifest containing raw placeholder strings', () => {
      fs.writeFileSync(tempFilePath, JSON.stringify({ entries: [validEntry] }), 'utf-8');
      const placeholderMeta = {
        ...validMeta,
        lastBuiltAt: 'PLACEHOLDER_ISO_8601',
        contentVersion: 'PLACEHOLDER_VERSION',
        embeddingModel: 'PLACEHOLDER_MODEL',
        fallbackResponse: 'PLACEHOLDER_FALLBACK_MESSAGE',
      };
      fs.writeFileSync(tempMetaPath, JSON.stringify(placeholderMeta), 'utf-8');

      const result = validateKb(tempFilePath, tempMetaPath);
      expect(result.success).toBe(false);
      expect(result.errors.some((err) => err.includes('lastBuiltAt'))).toBe(true);
      expect(result.errors.some((err) => err.includes('contentVersion'))).toBe(true);
      expect(result.errors.some((err) => err.includes('embeddingModel'))).toBe(true);
      expect(result.errors.some((err) => err.includes('fallbackResponse'))).toBe(true);
    });

    it('rejects metadata manifest when embeddingModel does not match EMBEDDING_MODEL', () => {
      fs.writeFileSync(tempFilePath, JSON.stringify({ entries: [validEntry] }), 'utf-8');
      const mismatchedMeta = {
        ...validMeta,
        embeddingModel: 'text-embedding-001',
      };
      fs.writeFileSync(tempMetaPath, JSON.stringify(mismatchedMeta), 'utf-8');

      const result = validateKb(tempFilePath, tempMetaPath);
      expect(result.success).toBe(false);
      expect(
        result.errors.some((err) =>
          err.includes("Metadata embeddingModel 'text-embedding-001' does not match")
        )
      ).toBe(true);
    });

    it('rejects metadata manifest when fallbackResponse does not match FALLBACK_RESPONSE', () => {
      fs.writeFileSync(tempFilePath, JSON.stringify({ entries: [validEntry] }), 'utf-8');
      const mismatchedMeta = {
        ...validMeta,
        fallbackResponse: 'Wrong fallback response.',
      };
      fs.writeFileSync(tempMetaPath, JSON.stringify(mismatchedMeta), 'utf-8');

      const result = validateKb(tempFilePath, tempMetaPath);
      expect(result.success).toBe(false);
      expect(
        result.errors.some((err) =>
          err.includes("Metadata fallbackResponse 'Wrong fallback response.' does not match")
        )
      ).toBe(true);
    });

    it('rejects metadata manifest containing unknown/unexpected fields', () => {
      fs.writeFileSync(tempFilePath, JSON.stringify({ entries: [validEntry] }), 'utf-8');
      const extraMeta = {
        ...validMeta,
        unexpectedMetaProp: 'invalid',
      };
      fs.writeFileSync(tempMetaPath, JSON.stringify(extraMeta), 'utf-8');

      const result = validateKb(tempFilePath, tempMetaPath);
      expect(result.success).toBe(false);
      expect(result.errors.some((err) => err.includes('unexpectedMetaProp'))).toBe(true);
    });

    it('reports clear error when metadata manifest file is missing', () => {
      fs.writeFileSync(tempFilePath, JSON.stringify({ entries: [validEntry] }), 'utf-8');
      const missingMetaPath = path.join(os.tmpdir(), `non-existent-meta-${Date.now()}.json`);

      const result = validateKb(tempFilePath, missingMetaPath);
      expect(result.success).toBe(false);
      expect(
        result.errors.some((err) => err.includes(`KB meta file not found at: ${missingMetaPath}`))
      ).toBe(true);
    });
  });
});
