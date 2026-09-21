import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateKb } from '../validate-kb.ts';

describe('validate-kb schema strictness', () => {
  let tempFilePath: string;

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

  beforeEach(() => {
    tempFilePath = path.join(
      os.tmpdir(),
      `kb-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
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
});
