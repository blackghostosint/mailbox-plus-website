import fs from 'fs';
import path from 'path';
import os from 'os';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  EMBEDDING_MODEL,
  EMBEDDING_DIMENSION,
  validateVector,
  validateEmbeddingSnapshot,
} from '../../knowledge/retrieval-core.ts';
import {
  loadEmbeddingsFile,
  verifyVectorCoverage,
  embeddingCache,
} from '../../knowledge/retrieval-test-runner.ts';

describe('Retrieval Vector Validation & Snapshot Gate', () => {
  let tempFilePath: string;

  const createValidVector = (length = EMBEDDING_DIMENSION, fillValue = 0.01): number[] => {
    return new Array(length).fill(fillValue);
  };

  beforeEach(() => {
    tempFilePath = path.join(
      os.tmpdir(),
      `embedding-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
    );
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  describe('validateVector', () => {
    it('accepts valid 768-element vector of finite numbers', () => {
      const vec = createValidVector(768, 0.1);
      const result = validateVector(vec, 'test-key');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects non-array inputs', () => {
      const result = validateVector('not-an-array', 'test-key');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('expected Array');
    });

    it('rejects vectors with wrong dimensions (< 768)', () => {
      const shortVec = createValidVector(767, 0.1);
      const result = validateVector(shortVec, 'short-key');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('expected 768, got 767');
    });

    it('rejects vectors with wrong dimensions (> 768)', () => {
      const longVec = createValidVector(769, 0.1);
      const result = validateVector(longVec, 'long-key');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('expected 768, got 769');
    });

    it('rejects vectors containing string elements', () => {
      const vec: any[] = createValidVector(768, 0.1);
      vec[10] = '0.123';
      const result = validateVector(vec, 'string-key');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('index 10');
      expect(result.error).toContain('expected finite number');
    });

    it('rejects vectors containing NaN or Infinity', () => {
      const vecNan: any[] = createValidVector(768, 0.1);
      vecNan[5] = NaN;
      const resNan = validateVector(vecNan, 'nan-key');
      expect(resNan.valid).toBe(false);
      expect(resNan.error).toContain('index 5');

      const vecInf: any[] = createValidVector(768, 0.1);
      vecInf[12] = Infinity;
      const resInf = validateVector(vecInf, 'inf-key');
      expect(resInf.valid).toBe(false);
      expect(resInf.error).toContain('index 12');
    });

    it('rejects vectors containing null or undefined', () => {
      const vecNull: any[] = createValidVector(768, 0.1);
      vecNull[3] = null;
      const resNull = validateVector(vecNull, 'null-key');
      expect(resNull.valid).toBe(false);
      expect(resNull.error).toContain('index 3');
    });
  });

  describe('validateEmbeddingSnapshot', () => {
    it('passes validation for valid snapshot with correct metadata and 768-d vectors', () => {
      const snapshot = {
        metadata: {
          model: EMBEDDING_MODEL,
          generatedAt: new Date().toISOString(),
        },
        embeddings: {
          'test::key1': createValidVector(768, 0.05),
          'test::key2': createValidVector(768, -0.02),
        },
      };

      const result = validateEmbeddingSnapshot(snapshot, 'test-file.json');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(Object.keys(result.vectors).length).toBe(2);
    });

    it('fails closed when snapshot metadata model is incorrect', () => {
      const wrongModelSnapshot = {
        metadata: {
          model: 'text-embedding-001',
          generatedAt: new Date().toISOString(),
        },
        embeddings: {
          'test::key1': createValidVector(768),
        },
      };

      const result = validateEmbeddingSnapshot(wrongModelSnapshot, 'test-file.json');
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) =>
          e.includes('expected "text-embedding-004", got "text-embedding-001"')
        )
      ).toBe(true);
    });

    it('fails closed when structured snapshot is missing metadata', () => {
      const noMetadataSnapshot = {
        embeddings: {
          'test::key1': createValidVector(768),
        },
      };

      const result = validateEmbeddingSnapshot(noMetadataSnapshot, 'test-file.json');
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Missing metadata'))).toBe(true);
    });

    it('fails closed with key-specific errors when vectors have wrong dimensions or non-finite values', () => {
      const badVecSnapshot = {
        metadata: {
          model: EMBEDDING_MODEL,
        },
        embeddings: {
          'test::good': createValidVector(768),
          'test::bad_dim': createValidVector(500),
          'test::bad_elem': (() => {
            const v = createValidVector(768);
            (v as any)[20] = 'not-a-number';
            return v;
          })(),
        },
      };

      const result = validateEmbeddingSnapshot(badVecSnapshot, 'test-file.json');
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.includes('test::bad_dim') && e.includes('expected 768, got 500')
        )
      ).toBe(true);
      expect(
        result.errors.some((e) => e.includes('test::bad_elem') && e.includes('index 20'))
      ).toBe(true);
    });
  });

  describe('loadEmbeddingsFile', () => {
    it('throws actionable error when loading malformed snapshot file', () => {
      const badSnapshot = {
        metadata: {
          model: 'wrong-model',
        },
        embeddings: {
          key1: createValidVector(100),
        },
      };

      fs.writeFileSync(tempFilePath, JSON.stringify(badSnapshot), 'utf-8');

      expect(() => loadEmbeddingsFile(tempFilePath)).toThrow(
        /Embedding snapshot validation failed/
      );
    });
  });

  describe('Actual repository embeddings.json snapshot', () => {
    it('validates actual repo knowledge/embeddings.json snapshot', () => {
      const snapshotPath = path.resolve(__dirname, '../../knowledge/embeddings.json');
      expect(fs.existsSync(snapshotPath)).toBe(true);

      const content = fs.readFileSync(snapshotPath, 'utf-8');
      const parsed = JSON.parse(content);
      const result = validateEmbeddingSnapshot(parsed, 'knowledge/embeddings.json');

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(Object.keys(result.vectors).length).toBeGreaterThan(100);
    });
  });
});
