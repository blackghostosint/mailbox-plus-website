import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { services } from '../config/services';

const PAGES_DIR = fileURLToPath(new URL('../pages', import.meta.url));

const STATIC_SERVICE_SLUGS = new Set([
  'pack-ship',
  'copy-print',
  'home-business',
  'private-mailbox-rental',
  'amazon-counter',
  'mailbox-rental-concord-ohio',
]);

describe('slug routing collision guard', () => {
  it('no root-level service slug collides with an unlisted static page file in pages/', () => {
    // List all top-level static page files/directories in astro/src/pages/
    const entries = fs.readdirSync(PAGES_DIR);
    const staticSlugs = new Set<string>();

    for (const entry of entries) {
      if (entry === '[slug].astro' || entry === 'api' || entry === '404.astro') continue;
      const fullPath = path.join(PAGES_DIR, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isFile()) {
        const slug = entry.replace(/\.(astro|ts|js)$/, '');
        if (slug && slug !== 'index') {
          staticSlugs.add(slug);
        }
      } else if (stat.isDirectory()) {
        staticSlugs.add(entry);
      }
    }

    const collisions: string[] = [];

    for (const service of services) {
      if (!service.slug) continue;
      const cleanSlug = service.slug.replace(/^\//, '').replace(/\/$/, '');
      if (cleanSlug.includes('/')) continue;

      if (staticSlugs.has(cleanSlug) && !STATIC_SERVICE_SLUGS.has(cleanSlug)) {
        collisions.push(`Service "${service.id}" (${cleanSlug}) collides with pages/${cleanSlug}`);
      }
    }

    expect(collisions).toEqual([]);
  });

  it('all entries in STATIC_SERVICE_SLUGS correspond to actual static pages or directories', () => {
    for (const slug of STATIC_SERVICE_SLUGS) {
      const fileExists =
        fs.existsSync(path.join(PAGES_DIR, `${slug}.astro`)) ||
        fs.existsSync(path.join(PAGES_DIR, `${slug}/index.astro`)) ||
        fs.existsSync(path.join(PAGES_DIR, slug));
      expect(fileExists, `STATIC_SERVICE_SLUGS entry "${slug}" must exist in pages/`).toBe(true);
    }
  });
});
