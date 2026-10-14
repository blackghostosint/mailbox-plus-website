import { describe, it, expect } from 'vitest';
import { checkSupplyChainActor, PROTECTED, DEFAULT_OWNER } from '../check-supply-chain-actor.mjs';

describe('check-supply-chain-actor', () => {
  const EXTERNAL_AUTHOR = 'external-contributor';
  const REPO_OWNER = DEFAULT_OWNER;

  describe('PROTECTED regular expression patterns', () => {
    it('matches workflow files', () => {
      expect(PROTECTED.some((rx) => rx.test('.github/workflows/ci.yml'))).toBe(true);
      expect(PROTECTED.some((rx) => rx.test('.github/workflows/deploy.yml'))).toBe(true);
    });

    it('matches root and astro package manifests', () => {
      expect(PROTECTED.some((rx) => rx.test('package.json'))).toBe(true);
      expect(PROTECTED.some((rx) => rx.test('package-lock.json'))).toBe(true);
      expect(PROTECTED.some((rx) => rx.test('astro/package.json'))).toBe(true);
      expect(PROTECTED.some((rx) => rx.test('astro/package-lock.json'))).toBe(true);
    });

    it('matches all scripts and files under scripts/verify/', () => {
      expect(PROTECTED.some((rx) => rx.test('scripts/verify/check-supply-chain-actor.mjs'))).toBe(
        true
      );
      expect(PROTECTED.some((rx) => rx.test('scripts/verify/pr-utils.mjs'))).toBe(true);
      expect(PROTECTED.some((rx) => rx.test('scripts/verify/audit-utils.mjs'))).toBe(true);
      expect(PROTECTED.some((rx) => rx.test('scripts/verify/check-owner-claims.mjs'))).toBe(true);
      expect(PROTECTED.some((rx) => rx.test('scripts/verify/README.md'))).toBe(true);
      expect(
        PROTECTED.some((rx) => rx.test('scripts/verify/__tests__/check-supply-chain-actor.test.ts'))
      ).toBe(true);
    });

    it('matches site build configurations (netlify.toml)', () => {
      expect(PROTECTED.some((rx) => rx.test('netlify.toml'))).toBe(true);
    });

    it('matches secret scanning configurations (.gitleaks*)', () => {
      expect(PROTECTED.some((rx) => rx.test('.gitleaks.toml'))).toBe(true);
      expect(PROTECTED.some((rx) => rx.test('.gitleaksignore'))).toBe(true);
    });

    it('does not match non-protected files', () => {
      expect(PROTECTED.some((rx) => rx.test('README.md'))).toBe(false);
      expect(PROTECTED.some((rx) => rx.test('astro/src/pages/index.astro'))).toBe(false);
      expect(PROTECTED.some((rx) => rx.test('scripts/audit-a11y.mjs'))).toBe(false);
      expect(PROTECTED.some((rx) => rx.test('content/articles/shipping-guide.md'))).toBe(false);
      expect(PROTECTED.some((rx) => rx.test('netlify/functions/health.ts'))).toBe(false);
    });
  });

  describe('External PRs modifying protected supply-chain files', () => {
    it('rejects external PRs modifying check-supply-chain-actor.mjs', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['scripts/verify/check-supply-chain-actor.mjs'],
        author: EXTERNAL_AUTHOR,
      });

      expect(result.success).toBe(false);
      expect(result.touched).toEqual(['scripts/verify/check-supply-chain-actor.mjs']);
      expect(result.message).toContain('touches protected supply-chain files');
      expect(result.message).toContain(EXTERNAL_AUTHOR);
    });

    it('rejects external PRs modifying helper modules in scripts/verify/', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['scripts/verify/pr-utils.mjs', 'scripts/verify/audit-utils.mjs'],
        author: EXTERNAL_AUTHOR,
      });

      expect(result.success).toBe(false);
      expect(result.touched).toEqual([
        'scripts/verify/pr-utils.mjs',
        'scripts/verify/audit-utils.mjs',
      ]);
    });

    it('rejects external PRs modifying netlify.toml', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['netlify.toml'],
        author: EXTERNAL_AUTHOR,
      });

      expect(result.success).toBe(false);
      expect(result.touched).toEqual(['netlify.toml']);
    });

    it('rejects external PRs modifying secret scanning configs (.gitleaks*)', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['.gitleaks.toml', '.gitleaksignore'],
        author: EXTERNAL_AUTHOR,
      });

      expect(result.success).toBe(false);
      expect(result.touched).toEqual(['.gitleaks.toml', '.gitleaksignore']);
    });

    it('rejects external PRs modifying workflow files or package manifests', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['.github/workflows/ci.yml', 'package.json', 'astro/package-lock.json'],
        author: EXTERNAL_AUTHOR,
      });

      expect(result.success).toBe(false);
      expect(result.touched).toEqual([
        '.github/workflows/ci.yml',
        'package.json',
        'astro/package-lock.json',
      ]);
    });

    it('rejects mixed PRs and reports all touched protected files', () => {
      const result = checkSupplyChainActor({
        changedFiles: [
          'astro/src/pages/index.astro',
          'scripts/verify/pr-utils.mjs',
          'README.md',
          'netlify.toml',
        ],
        author: EXTERNAL_AUTHOR,
      });

      expect(result.success).toBe(false);
      expect(result.touched).toEqual(['scripts/verify/pr-utils.mjs', 'netlify.toml']);
      expect(result.message).toContain('scripts/verify/pr-utils.mjs');
      expect(result.message).toContain('netlify.toml');
    });
  });

  describe('Repository owner PRs and non-protected file changes', () => {
    it('allows repository owner PRs touching protected files', () => {
      const result = checkSupplyChainActor({
        changedFiles: [
          'scripts/verify/check-supply-chain-actor.mjs',
          'netlify.toml',
          '.gitleaks.toml',
        ],
        author: REPO_OWNER,
      });

      expect(result.success).toBe(true);
      expect(result.touched).toEqual([
        'scripts/verify/check-supply-chain-actor.mjs',
        'netlify.toml',
        '.gitleaks.toml',
      ]);
      expect(result.message).toContain(`protected files touched by repo owner (${REPO_OWNER})`);
    });

    it('handles author username case-insensitively for repo owner check', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['netlify.toml'],
        author: REPO_OWNER.toUpperCase(),
        owner: REPO_OWNER,
      });

      expect(result.success).toBe(true);
    });

    it('allows external PRs touching only non-protected files', () => {
      const result = checkSupplyChainActor({
        changedFiles: [
          'README.md',
          'astro/src/pages/index.astro',
          'content/articles/shipping.md',
          'scripts/audit-a11y.mjs',
        ],
        author: EXTERNAL_AUTHOR,
      });

      expect(result.success).toBe(true);
      expect(result.touched).toEqual([]);
      expect(result.message).toContain('no protected supply-chain files touched');
    });

    it('succeeds when no files are touched or file list is empty', () => {
      const result = checkSupplyChainActor({
        changedFiles: [],
        author: EXTERNAL_AUTHOR,
      });

      expect(result.success).toBe(true);
      expect(result.touched).toEqual([]);
    });
  });

  describe('Custom owner and edge cases', () => {
    it('supports custom owner parameter', () => {
      const customOwner = 'custom-org-admin';

      const allowedResult = checkSupplyChainActor({
        changedFiles: ['netlify.toml'],
        author: customOwner,
        owner: customOwner,
      });
      expect(allowedResult.success).toBe(true);

      const rejectedResult = checkSupplyChainActor({
        changedFiles: ['netlify.toml'],
        author: EXTERNAL_AUTHOR,
        owner: customOwner,
      });
      expect(rejectedResult.success).toBe(false);
    });
  });
});
