import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import * as sharedEsm from '@mailbox-plus/shared';
import * as contractsSubpath from '@mailbox-plus/shared/contracts';
import * as httpClientSubpath from '@mailbox-plus/shared/http-client';
import * as urlSubpath from '@mailbox-plus/shared/url-normalization';
import * as articleSchemaSubpath from '@mailbox-plus/shared/article-schema';
import * as workspacePathsSubpath from '@mailbox-plus/shared/workspace-paths';
import * as dateUtilsSubpath from '@mailbox-plus/shared/date-utils';
import * as escapeHtmlSubpath from '@mailbox-plus/shared/escapeHtml';

const require = createRequire(import.meta.url);

describe('@mailbox-plus/shared workspace package', () => {
  it('exports all domain utilities via ESM barrel and subpaths', () => {
    expect(typeof sharedEsm.escapeHtml).toBe('function');
    expect(typeof sharedEsm.toCanonicalUrlPath).toBe('function');
    expect(typeof sharedEsm.toRouteKey).toBe('function');
    expect(typeof sharedEsm.isKnownRoute).toBe('function');
    expect(typeof sharedEsm.articleFrontmatterSchema.safeParse).toBe('function');
    expect(typeof sharedEsm.validateArticleFrontmatter).toBe('function');
    expect(typeof sharedEsm.getWorkspaceRoot).toBe('function');
    expect(typeof sharedEsm.atomicWriteFileSync).toBe('function');
    expect(typeof sharedEsm.atomicWriteJsonSync).toBe('function');
    expect(typeof sharedEsm.httpClient).toBe('function');
    expect(typeof sharedEsm.ApiClientError).toBe('function');
    expect(typeof sharedEsm.isValidCheckoutUrl).toBe('function');
    expect(typeof sharedEsm.CreateCheckoutRequestSchema.safeParse).toBe('function');
    expect(typeof sharedEsm.toISODateString).toBe('function');
    expect(typeof sharedEsm.parseValidDate).toBe('function');

    expect(contractsSubpath.isValidCheckoutUrl).toBe(sharedEsm.isValidCheckoutUrl);
    expect(httpClientSubpath.httpClient).toBe(sharedEsm.httpClient);
    expect(urlSubpath.toRouteKey).toBe(sharedEsm.toRouteKey);
    expect(articleSchemaSubpath.articleFrontmatterSchema).toBe(sharedEsm.articleFrontmatterSchema);
    expect(workspacePathsSubpath.getWorkspaceRoot).toBe(sharedEsm.getWorkspaceRoot);
    expect(dateUtilsSubpath.toISODateString).toBe(sharedEsm.toISODateString);
    expect(escapeHtmlSubpath.escapeHtml).toBe(sharedEsm.escapeHtml);
  });

  it('supports synchronous CommonJS require() on barrel and subpaths', () => {
    const sharedCjs = require('@mailbox-plus/shared');
    const contractsCjs = require('@mailbox-plus/shared/contracts');
    const httpClientCjs = require('@mailbox-plus/shared/http-client');
    const escapeHtmlCjs = require('@mailbox-plus/shared/escapeHtml');
    const articleSchemaCjs = require('@mailbox-plus/shared/article-schema');
    const workspacePathsCjs = require('@mailbox-plus/shared/workspace-paths');
    const urlNormCjs = require('@mailbox-plus/shared/url-normalization');
    const dateUtilsCjs = require('@mailbox-plus/shared/date-utils');

    expect(sharedCjs.escapeHtml('<b>a & b</b>')).toBe('&lt;b&gt;a &amp; b&lt;/b&gt;');
    expect(sharedCjs.toRouteKey('/pack-ship/?ref=nav#top')).toBe('/pack-ship');
    expect(sharedCjs.toCanonicalUrlPath('/pack-ship')).toBe('/pack-ship/');
    expect(sharedCjs.toISODateString('2026-08-19T12:00:00Z')).toBe('2026-08-19');
    expect(contractsCjs.isValidCheckoutUrl('https://checkout.stripe.com/c/pay/cs_test_1')).toBe(
      true
    );
    expect(typeof httpClientCjs.httpClient.get).toBe('function');
    expect(escapeHtmlCjs.escapeHtml).toBe(sharedCjs.escapeHtml);
    expect(typeof articleSchemaCjs.validateArticleFrontmatter).toBe('function');
    expect(typeof workspacePathsCjs.getWorkspaceRoot).toBe('function');
    expect(typeof urlNormCjs.isKnownRoute).toBe('function');
    expect(typeof dateUtilsCjs.compareDatesDesc).toBe('function');
  });

  it('validates article frontmatter schemas, Date transforms, intentKeys, and route registries', () => {
    const baseValid = {
      title: 'Shipping Fragile Glassware',
      description: 'How to pack fragile glassware safely.',
      slug: 'shipping-fragile-glassware',
      category: 'pack-ship',
      intentKey: 'pack-fragile-glassware',
      pubDate: new Date('2026-09-01T00:00:00.000Z'),
      image: 'https://example.com/glass.webp',
      imageAlt: 'Packed glassware box',
      keywords: ['fragile shipping'],
      relatedServices: ['/pack-ship/', '/articles/custom-packing/'],
      author: 'Mailbox Plus',
      faqs: [{ question: 'Do you pack glass?', answer: 'Yes, double-boxed.' }],
    };

    const registry: sharedEsm.RouteRegistry = {
      validRoutes: new Set(['/pack-ship']),
      dynamicPrefixes: [{ prefix: '/articles', catchAll: false }],
      intentKeyMap: new Map(),
    };

    const setKeys = new Set<string>();
    const res1 = sharedEsm.validateArticleFrontmatter(baseValid, {
      fileName: 'glass.md',
      registry,
      intentKeys: setKeys,
    });
    expect(res1.success).toBe(true);
    if (res1.success) {
      expect(res1.data.pubDate).toBe('2026-09-01T00:00:00.000Z');
    }

    // Duplicate in Set
    const resDupSet = sharedEsm.validateArticleFrontmatter(baseValid, 'glass-copy.md', {
      intentKeys: setKeys,
    });
    expect(resDupSet.success).toBe(false);
    if (!resDupSet.success) {
      expect(resDupSet.errors.join(' ')).toContain('Duplicate intentKey');
    }

    // Map intentKeys: new entry, same-file recheck, array conflict, non-string conflict, and unknown route
    const mapKeys = new Map<string, unknown>();
    expect(
      sharedEsm.validateArticleFrontmatter(baseValid, 'glass.md', { intentKeys: mapKeys }).success
    ).toBe(true);
    expect(
      sharedEsm.validateArticleFrontmatter(baseValid, 'glass.md', { intentKeys: mapKeys }).success
    ).toBe(true);
    expect(
      sharedEsm.validateArticleFrontmatter(baseValid, 'other.md', { intentKeys: mapKeys }).success
    ).toBe(false);

    const arrayMap = new Map<string, unknown>([['pack-fragile-glassware', ['glass.md', 'alt.md']]]);
    const resArr = sharedEsm.validateArticleFrontmatter(baseValid, 'glass.md', {
      intentKeys: arrayMap,
    });
    expect(resArr.success).toBe(false);

    const numMap = new Map<string, unknown>([['pack-fragile-glassware', 42]]);
    const resNum = sharedEsm.validateArticleFrontmatter(baseValid, 'glass.md', {
      intentKeys: numMap,
    });
    expect(resNum.success).toBe(false);

    const badRoute = sharedEsm.validateArticleFrontmatter(
      { ...baseValid, intentKey: 'unique-intent', relatedServices: ['/nonexistent-route/'] },
      'bad-route.md',
      { registry }
    );
    expect(badRoute.success).toBe(false);
    if (!badRoute.success) {
      expect(badRoute.errors[0]).toContain('does not match any known route');
    }

    const invalidSchema = sharedEsm.validateArticleFrontmatter({ title: '' }, 'invalid.md');
    expect(invalidSchema.success).toBe(false);
  });

  it('resolves workspace paths and writes files atomically including cleanup on error', async () => {
    const fs = await import('node:fs');
    const os = await import('node:os');
    const path = await import('node:path');

    sharedEsm.resetWorkspaceRootCache();
    const repoRoot = sharedEsm.getWorkspaceRoot();
    expect(fs.existsSync(path.join(repoRoot, 'package.json'))).toBe(true);
    // Second call hits cache
    expect(sharedEsm.getWorkspaceRoot()).toBe(repoRoot);

    const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'shared-ws-paths-'));
    try {
      // Directory hierarchy without .git falls back to nearest workspaces package.json
      const wsRoot = path.join(tmpBase, 'mono');
      const nestedPkg = path.join(wsRoot, 'packages', 'sub');
      const brokenPkgDir = path.join(nestedPkg, 'broken');
      fs.mkdirSync(brokenPkgDir, { recursive: true });
      fs.writeFileSync(
        path.join(wsRoot, 'package.json'),
        JSON.stringify({ name: 'mono', workspaces: ['packages/*'] })
      );
      fs.writeFileSync(path.join(nestedPkg, 'package.json'), JSON.stringify({ name: 'sub' }));
      fs.writeFileSync(path.join(brokenPkgDir, 'package.json'), '{ malformed json');

      expect(sharedEsm.getWorkspaceRoot(brokenPkgDir)).toBe(wsRoot);

      // Atomic JSON write into new nested directory
      const jsonTarget = path.join(tmpBase, 'nested-out', 'data.json');
      sharedEsm.atomicWriteJsonSync(jsonTarget, { ok: true });
      expect(JSON.parse(fs.readFileSync(jsonTarget, 'utf8'))).toEqual({ ok: true });

      // Atomic write cleans up temp file when rename fails (target is an existing directory)
      const dirCollision = path.join(tmpBase, 'existing-dir');
      fs.mkdirSync(dirCollision, { recursive: true });
      expect(() => sharedEsm.atomicWriteFileSync(dirCollision, 'content')).toThrow();
      const leftovers = fs
        .readdirSync(tmpBase)
        .filter((name) => name.startsWith('.existing-dir.tmp.'));
      expect(leftovers).toEqual([]);
    } finally {
      fs.rmSync(tmpBase, { recursive: true, force: true });
      sharedEsm.resetWorkspaceRootCache();
    }
  });
});
