import { describe, it, expect } from 'vitest';
import {
  checkSupplyChainActor,
  verifyGitleaksConfigExemptionsNotBroadened,
  PROTECTED,
  DEFAULT_OWNER,
} from '../check-supply-chain-actor.mjs';

describe('check-supply-chain-actor', () => {
  const EXTERNAL_AUTHOR = 'external-contributor';
  const REPO_OWNER = DEFAULT_OWNER;

  describe('verifyGitleaksConfigExemptionsNotBroadened', () => {
    it('passes for valid path-scoped gitleaks config with exact slug regexes', () => {
      const validConfig = `
title = "Gitleaks secret scanning configuration"
useDefault = true

[allowlist]
description = "Global allowlist for verified non-secret exact strings and designated test/example paths"
regexes = [
  '''chardon-returns-r1''',
  '''fedex-demand-surcharges-2026'''
]
paths = [
  '''\\.env\\.example''',
  '''netlify/functions/__tests__/.*''',
  '''astro/src/lib/__tests__/.*'''
]
`;
      const result = verifyGitleaksConfigExemptionsNotBroadened(validConfig);
      expect(result.valid).toBe(true);
    });

    it('fails when useDefault is missing or false', () => {
      const invalidConfig = `
useDefault = false
[allowlist]
regexes = ['slug-1']
paths = ['tests/.*']
`;
      const result = verifyGitleaksConfigExemptionsNotBroadened(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('useDefault = true');
    });

    it('fails when custom rules blocks are introduced', () => {
      const invalidConfig = `
useDefault = true
[[rules]]
id = "custom-rule"
regex = '''.*'''
`;
      const result = verifyGitleaksConfigExemptionsNotBroadened(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('custom [[rules]] overrides');
    });

    it('fails when regexes contains broad wildcards or secret placeholders', () => {
      const invalidConfig = `
useDefault = true
[allowlist]
regexes = ['sk_test_.*']
paths = ['tests/.*']
`;
      const result = verifyGitleaksConfigExemptionsNotBroadened(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('disallowed wildcard or secret placeholder pattern');
    });

    it('fails when paths entry is outside approved test/example scopes', () => {
      const invalidConfig = `
useDefault = true
[allowlist]
regexes = ['slug-1']
paths = ['astro/src/pages/.*']
`;
      const result = verifyGitleaksConfigExemptionsNotBroadened(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('outside approved test/example path scopes');
    });

    it('fails when malicious stopwords exemption is introduced', () => {
      const invalidConfig = `
useDefault = true
[allowlist]
stopwords = ["sk_live_"]
regexes = ['slug-1']
paths = ['tests/.*']
`;
      const result = verifyGitleaksConfigExemptionsNotBroadened(invalidConfig);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('unauthorized exemption key "stopwords"');
    });

    it('fails when malicious commits or regexTarget exemption is introduced', () => {
      const invalidCommitsConfig = `
useDefault = true
[allowlist]
commits = ["a1b2c3d"]
`;
      expect(verifyGitleaksConfigExemptionsNotBroadened(invalidCommitsConfig).valid).toBe(false);
      expect(verifyGitleaksConfigExemptionsNotBroadened(invalidCommitsConfig).reason).toContain(
        'unauthorized exemption key "commits"'
      );

      const invalidTargetConfig = `
useDefault = true
[allowlist]
regexTarget = "match"
`;
      expect(verifyGitleaksConfigExemptionsNotBroadened(invalidTargetConfig).valid).toBe(false);
      expect(verifyGitleaksConfigExemptionsNotBroadened(invalidTargetConfig).reason).toContain(
        'unauthorized exemption key "regexTarget"'
      );
    });

    it('fails when dotted key exemptions or unauthorized sections are introduced', () => {
      const invalidDottedConfig = `
useDefault = true
allowlist.stopwords = ["sk_live_"]
`;
      expect(verifyGitleaksConfigExemptionsNotBroadened(invalidDottedConfig).valid).toBe(false);
      expect(verifyGitleaksConfigExemptionsNotBroadened(invalidDottedConfig).reason).toContain(
        'unauthorized exemption key "stopwords"'
      );

      const invalidSectionConfig = `
useDefault = true
[rules]
id = "custom-rule"
`;
      expect(verifyGitleaksConfigExemptionsNotBroadened(invalidSectionConfig).valid).toBe(false);
      expect(verifyGitleaksConfigExemptionsNotBroadened(invalidSectionConfig).reason).toContain(
        'unauthorized section "[rules]"'
      );
    });
  });

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
      // Strict owner-only files are reported before the general protected set.
      expect(result.touched).toEqual(['package.json', 'astro/package-lock.json']);
      expect(result.message).toContain('owner-only');
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
      // netlify.toml is strict owner-only and short-circuits the general report.
      expect(result.touched).toEqual(['netlify.toml']);
      expect(result.message).toContain('netlify.toml');
    });

    it('rejects AUTHORIZED BOTS touching strict owner-only dependency/config files (PR #797 gap)', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['package.json', 'package-lock.json'],
        author: 'google-labs-stitch[bot]',
      });

      expect(result.success).toBe(false);
      expect(result.touched).toEqual(['package.json', 'package-lock.json']);
      expect(result.message).toContain('owner-only for EVERY author');
    });

    it('still allows authorized bots on non-strict protected files (CI/verify scripts)', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['.github/workflows/ci.yml', 'scripts/verify/pr-utils.mjs'],
        author: 'google-labs-stitch',
      });

      expect(result.success).toBe(true);
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

    it('allows authorized bot logins (google-labs-stitch[bot]) touching protected files', () => {
      const result = checkSupplyChainActor({
        changedFiles: ['scripts/verify/check-supply-chain-actor.mjs'],
        author: 'google-labs-stitch[bot]',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain(
        'protected files touched by repo owner (google-labs-stitch[bot])'
      );
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
