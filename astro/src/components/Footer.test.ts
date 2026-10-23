import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Footer.astro accessibility', () => {
  const footerPath = path.resolve(__dirname, './Footer.astro');

  it('contains google-add-preferred-source-btn container with fallback text', () => {
    const footerContent = fs.readFileSync(footerPath, 'utf8');

    // Verify the preferred source container exists
    expect(footerContent).toContain('google-add-preferred-source-btn');

    // Verify inner visually hidden span for screen readers
    expect(footerContent).toMatch(
      /<span class="sr-only">\s*Add Mailbox Plus as a preferred source on Google\s*<\/span>/
    );
  });
});
