import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { checkFontCdn } from '../../check-font-cdn';

describe('check-font-cdn.ts', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = join(
      tmpdir(),
      `check-font-cdn-test-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('passes when no external font CDN links are present', () => {
    const filePath = join(tempDir, 'BaseLayout.astro');
    writeFileSync(
      filePath,
      `---
import '../styles/global.css';
---
<html>
  <head>
    <link rel="preload" href="/fonts/dmsans-regular.woff2" as="font" type="font/woff2" crossorigin />
  </head>
  <body></body>
</html>`
    );

    const result = checkFontCdn([tempDir]);
    expect(result.success).toBe(true);
    expect(result.totalViolations).toBe(0);
    expect(result.scannedFilesCount).toBe(1);
  });

  it('fails when google fonts api URL is detected', () => {
    const filePath = join(tempDir, 'Layout.astro');
    writeFileSync(
      filePath,
      `<html>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
  </head>
</html>`
    );

    const result = checkFontCdn([tempDir]);
    expect(result.success).toBe(false);
    expect(result.totalViolations).toBe(1);
    expect(result.violations[0].match).toBe('fonts.googleapis.com');
  });

  it('fails when google fonts gstatic URL is detected', () => {
    const filePath = join(tempDir, 'styles.css');
    writeFileSync(filePath, `@import url('https://fonts.gstatic.com/s/dmsans/v1/font.woff2');`);

    const result = checkFontCdn([tempDir]);
    expect(result.success).toBe(false);
    expect(result.totalViolations).toBe(1);
    expect(result.violations[0].match).toBe('fonts.gstatic.com');
  });

  it('passes on actual codebase (astro/src & public)', () => {
    const result = checkFontCdn();
    expect(result.success).toBe(true);
    expect(result.totalViolations).toBe(0);
  });
});
