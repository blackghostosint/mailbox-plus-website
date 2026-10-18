// @vitest-environment happy-dom
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('BaseLayout skip navigation and main landmark', () => {
  const layoutPath = path.resolve(__dirname, 'BaseLayout.astro');

  it('contains the skip navigation link targeting #main-content', () => {
    const content = fs.readFileSync(layoutPath, 'utf-8');
    expect(content).toMatch(/href="#main-content"/);
    expect(content).toContain('Skip to main content');
  });

  it('includes tabindex="-1" on <main id="main-content"> for WebKit keyboard focus redirection', () => {
    const content = fs.readFileSync(layoutPath, 'utf-8');
    expect(content).toMatch(/<main\s+id="main-content"[^>]*tabindex="-1"/);
  });

  it('includes focus:outline-none class on <main id="main-content"> to prevent focus ring', () => {
    const content = fs.readFileSync(layoutPath, 'utf-8');
    expect(content).toMatch(/<main\s+id="main-content"[^>]*class="[^"]*focus:outline-none[^"]*"/);
  });

  it('verifies rendered dist HTML contains main content with tabindex="-1" if dist exists', () => {
    const distPath = path.resolve(__dirname, '../../dist/index.html');
    if (fs.existsSync(distPath)) {
      const html = fs.readFileSync(distPath, 'utf-8');
      const div = document.createElement('div');
      div.innerHTML = html;

      const main = div.querySelector('main#main-content');
      expect(main).not.toBeNull();
      expect(main?.getAttribute('tabindex')).toBe('-1');
      expect(main?.classList.contains('focus:outline-none')).toBe(true);

      const skipLink = div.querySelector('a[href="#main-content"]');
      expect(skipLink).not.toBeNull();
    }
  });
});
