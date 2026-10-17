import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { convertImages, INPUT_FILE, WEBP_OUTPUT, AVIF_OUTPUT } from '../convert-images.mjs';

describe('convert-images module', () => {
  const tmpDir = path.resolve(process.cwd(), '../scripts/__test_convert_images_tmp__');

  beforeEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('exports default input and output file paths', () => {
    expect(INPUT_FILE).toContain('logo.png');
    expect(WEBP_OUTPUT).toContain('logo.webp');
    expect(AVIF_OUTPUT).toContain('logo.avif');
  });

  it('handles missing input image gracefully', async () => {
    const missingInput = path.join(tmpDir, 'non-existent.png');
    const webpOut = path.join(tmpDir, 'test.webp');
    const avifOut = path.join(tmpDir, 'test.avif');

    const result = await convertImages({
      input: missingInput,
      webpOutput: webpOut,
      avifOutput: avifOut,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('does not exist');
    expect(fs.existsSync(webpOut)).toBe(false);
    expect(fs.existsSync(avifOut)).toBe(false);
  });

  it('throws error when input is missing and throwOnError is true', async () => {
    const missingInput = path.join(tmpDir, 'non-existent.png');

    await expect(
      convertImages({
        input: missingInput,
        throwOnError: true,
      })
    ).rejects.toThrow('does not exist');
  });

  it('successfully converts source image to WebP and AVIF formats', async () => {
    const dummyInput = path.join(tmpDir, 'test-input.png');
    const webpOut = path.join(tmpDir, 'test-output.webp');
    const avifOut = path.join(tmpDir, 'test-output.avif');

    // Create a 10x10 dummy PNG image using sharp
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

    const result = await convertImages({
      input: dummyInput,
      webpOutput: webpOut,
      avifOutput: avifOut,
    });

    expect(result.success).toBe(true);
    expect(result.webpSuccess).toBe(true);
    expect(result.avifSuccess).toBe(true);
    expect(fs.existsSync(webpOut)).toBe(true);
    expect(fs.existsSync(avifOut)).toBe(true);
  });
});
