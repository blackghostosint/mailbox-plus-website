import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateBuildEnv,
  parseDotenvFile,
  CANONICAL_R2_BASE_URL,
} from '../../verify-build-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');

describe('verify-build-env.mjs', () => {
  describe('parseDotenvFile', () => {
    it('returns empty object for non-existent file', () => {
      expect(parseDotenvFile('/non-existent-path/.env')).toEqual({});
    });
  });

  describe('validateBuildEnv', () => {
    it('passes in production mode when all required env vars are valid', () => {
      const mockEnv = {
        VITE_R2_PUBLIC_BASE_URL: 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev',
        VITE_RECAPTCHA_SITE_KEY: 'test-recaptcha-site-key',
      };
      const res = validateBuildEnv({ env: mockEnv, isProduction: true });
      expect(res.success).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it('fails in production mode if VITE_R2_PUBLIC_BASE_URL is missing', () => {
      const mockEnv = {
        VITE_RECAPTCHA_SITE_KEY: 'test-recaptcha-site-key',
      };
      const res = validateBuildEnv({ env: mockEnv, isProduction: true });
      expect(res.success).toBe(false);
      expect(res.errors).toContain('Missing required variable: VITE_R2_PUBLIC_BASE_URL');
    });

    it('fails in production mode if RECAPTCHA_SITE_KEY is missing', () => {
      const mockEnv = {
        VITE_R2_PUBLIC_BASE_URL: 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev',
      };
      const res = validateBuildEnv({ env: mockEnv, isProduction: true });
      expect(res.success).toBe(false);
      expect(res.errors).toContain(
        'Missing required variable: VITE_RECAPTCHA_SITE_KEY or RECAPTCHA_SITE_KEY'
      );
    });

    it('fails in production mode if VITE_R2_PUBLIC_BASE_URL is not http/https', () => {
      const mockEnv = {
        VITE_R2_PUBLIC_BASE_URL: 'ftp://invalid-url.com',
        VITE_RECAPTCHA_SITE_KEY: 'test-recaptcha-site-key',
      };
      const res = validateBuildEnv({ env: mockEnv, isProduction: true });
      expect(res.success).toBe(false);
      expect(res.errors[0]).toContain('Must start with http:// or https://');
    });

    it('flags secret hygiene violation if GEMINI_API_KEY has VITE_ prefix', () => {
      const mockEnv = {
        VITE_R2_PUBLIC_BASE_URL: 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev',
        VITE_RECAPTCHA_SITE_KEY: 'test-key',
        VITE_GEMINI_API_KEY: 'secret-key-exposed',
      };
      const res = validateBuildEnv({ env: mockEnv, isProduction: true });
      expect(res.success).toBe(false);
      expect(res.errors[0]).toContain(
        'Secret hygiene violation: GEMINI_API_KEY must not be exposed'
      );
    });

    it('emits warnings and passes in development mode when required env vars are missing', () => {
      const mockEnv = {};
      const res = validateBuildEnv({ env: mockEnv, isProduction: false });
      expect(res.success).toBe(true);
      expect(res.errors).toHaveLength(0);
      expect(res.warnings.length).toBeGreaterThan(0);
      expect(res.warnings[0]).toContain(CANONICAL_R2_BASE_URL);
    });
  });

  describe('CLI Execution', () => {
    it('executes in under 500ms and exits 0 when valid in production mode', () => {
      const start = performance.now();
      const stdout = execSync('node scripts/verify-build-env.mjs', {
        cwd: ROOT,
        encoding: 'utf8',
        env: {
          ...process.env,
          NODE_ENV: 'production',
          VITE_R2_PUBLIC_BASE_URL: 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev',
          VITE_RECAPTCHA_SITE_KEY: 'test-site-key',
        },
      });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
      expect(stdout).toContain('✅ Pre-build environment check passed');
    });

    it('exits with code 1 in production mode when required variables are missing', () => {
      let threw = false;
      try {
        execSync('node scripts/verify-build-env.mjs', {
          cwd: ROOT,
          encoding: 'utf8',
          env: {
            ...process.env,
            NODE_ENV: 'production',
            VITE_R2_PUBLIC_BASE_URL: '',
            VITE_RECAPTCHA_SITE_KEY: '',
            RECAPTCHA_SITE_KEY: '',
          },
        });
      } catch (err: any) {
        threw = true;
        expect(err.status).toBe(1);
        expect(err.stderr || err.stdout).toContain('❌ Pre-build environment validation failed');
      }
      expect(threw).toBe(true);
    });
  });
});
