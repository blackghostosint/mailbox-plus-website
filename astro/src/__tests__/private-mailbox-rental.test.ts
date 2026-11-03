// @vitest-environment happy-dom
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('private-mailbox-rental comparison table accessibility (WCAG 1.3.1)', () => {
  const pagePath = path.resolve(__dirname, '../pages/private-mailbox-rental.astro');
  const distPagePath = path.resolve(__dirname, '../../../dist/private-mailbox-rental/index.html');

  it('ensures lead column header in the comparison table has accessible text "Feature"', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    expect(content).toMatch(/<th\s+scope="col">\s*Feature\s*<\/th>/i);
  });

  it('ensures all th elements in the comparison table contain non-empty accessible names', () => {
    const content = fs.readFileSync(pagePath, 'utf-8');
    const tableMatch = content.match(/<table\s+class="compare">([\s\S]*?)<\/table>/i);
    expect(tableMatch).not.toBeNull();

    const container = document.createElement('div');
    container.innerHTML = tableMatch![0];

    const table = container.querySelector('table.compare');
    expect(table).not.toBeNull();

    const columnHeaders = Array.from(table!.querySelectorAll('thead th'));
    expect(columnHeaders.length).toBeGreaterThan(0);

    const columnLabels = columnHeaders.map((th) => {
      const accessibleName =
        th.getAttribute('aria-label') || th.getAttribute('title') || th.textContent?.trim() || '';
      expect(accessibleName).not.toBe('');
      return accessibleName;
    });

    expect(columnLabels).toEqual(['Feature', 'USPS PO Box', 'The UPS Store', 'Mailbox Plus']);

    const rowHeaders = Array.from(table!.querySelectorAll('tbody th'));
    expect(rowHeaders.length).toBeGreaterThan(0);

    rowHeaders.forEach((th) => {
      const accessibleName =
        th.getAttribute('aria-label') || th.getAttribute('title') || th.textContent?.trim() || '';
      expect(accessibleName).not.toBe('');
      expect(th.getAttribute('scope')).toBe('row');
    });
  });

  it('verifies rendered dist HTML comparison table th elements if dist exists', () => {
    if (fs.existsSync(distPagePath)) {
      const html = fs.readFileSync(distPagePath, 'utf-8');
      const container = document.createElement('div');
      container.innerHTML = html;

      const table = container.querySelector('table.compare');
      expect(table).not.toBeNull();

      const allThElements = Array.from(table!.querySelectorAll('th'));
      expect(allThElements.length).toBeGreaterThan(0);

      allThElements.forEach((th) => {
        const accessibleName =
          th.getAttribute('aria-label') || th.getAttribute('title') || th.textContent?.trim() || '';
        expect(accessibleName.length).toBeGreaterThan(0);
      });

      const leadColHeader = table!.querySelector('thead th:first-child');
      expect(leadColHeader).not.toBeNull();
      expect(leadColHeader?.textContent?.trim()).toBe('Feature');
      expect(leadColHeader?.getAttribute('scope')).toBe('col');
    }
  });
});
