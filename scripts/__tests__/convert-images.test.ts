import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';
import { convertImages, INPUT_FILE, WEBP_OUTPUT, AVIF_OUTPUT } from '../../convert-images.cjs';

describe('convert-images module', () => {
  const tmpDir = path.resolve(process.cwd(), 'scripts/__test_convert_images_tmp__');

  beforeEach(() => {
    process.exitCode = undefined;
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    process.exitCode = undefined;
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('exports default input and output file paths', () => {
    expect(INPUT_FILE).toContain('logo.png');
    expect(WEBP_OUTPUT).toContain('logo.webp');
    expect(AVIF_OUTPUT).toContain('logo.avif');
  });

  it('handles missing input image gracefully by throwing error and setting process.exitCode', async () => {
    const missingInput = path.join(tmpDir, 'non-existent.png');
    const webpOut = path.join(tmpDir, 'test.webp');
    const avifOut = path.join(tmpDir, 'test.avif');

    await expect(
      convertImages({
        input: missingInput,
        webpOutput: webpOut,
        avifOutput: avifOut,
      })
    ).rejects.toThrow('does not exist');

    expect(process.exitCode).toBe(1);
    expect(fs.existsSync(webpOut)).toBe(false);
    expect(fs.existsSync(avifOut)).toBe(false);
  });

  it('successfully converts source image to WebP and AVIF formats', async () => {
    const dummyInput = path.join(tmpDir, 'test-input.png');
    const webpOut = path.join(tmpDir, 'test-output.webp');
    const avifOut = path.join(tmpDir, 'test-output.avif');

    await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toFile(dummyInput);

    const results = await convertImages({
      input: dummyInput,
      webpOutput: webpOut,
      avifOutput: avifOut,
    });

    expect(results).toHaveLength(2);
    expect(fs.existsSync(webpOut)).toBe(true);
    expect(fs.existsSync(avifOut)).toBe(true);
  });

  it('rethrows error and sets process.exitCode = 1 when sharp processing fails', async () => {
    const invalidInput = path.join(tmpDir, 'invalid-image.png');
    fs.writeFileSync(invalidInput, 'not a real image data');

    const webpOut = path.join(tmpDir, 'corrupted.webp');
    const avifOut = path.join(tmpDir, 'corrupted.avif');

    await expect(
      convertImages({
        input: invalidInput,
        webpOutput: webpOut,
        avifOutput: avifOut,
      })
    ).rejects.toThrow();

    expect(process.exitCode).toBe(1);
    expect(fs.existsSync(webpOut)).toBe(false);
    expect(fs.existsSync(avifOut)).toBe(false);
  });
});
