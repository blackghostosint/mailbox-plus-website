#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export const INPUT_FILE = path.join(rootDir, 'logo.png');
export const WEBP_OUTPUT = path.join(rootDir, 'public', 'logo.webp');
export const AVIF_OUTPUT = path.join(rootDir, 'public', 'logo.avif');

export async function convertImages(options = {}) {
  const input = options.input || INPUT_FILE;
  const webpOutput = options.webpOutput || WEBP_OUTPUT;
  const avifOutput = options.avifOutput || AVIF_OUTPUT;

  if (!fs.existsSync(input)) {
    const errorMsg = `Error: Source image '${input}' does not exist.`;
    console.error(errorMsg);
    if (options.throwOnError) {
      throw new Error(errorMsg);
    }
    return { success: false, error: errorMsg };
  }

  let webpSuccess = false;
  let avifSuccess = false;

  try {
    await sharp(input).webp({ quality: 80 }).toFile(webpOutput);
    console.log(`Converted to WebP: ${webpOutput}`);
    webpSuccess = true;
  } catch (err) {
    console.error('WebP conversion error:', err);
  }

  try {
    await sharp(input).avif({ quality: 80 }).toFile(avifOutput);
    console.log(`Converted to AVIF: ${avifOutput}`);
    avifSuccess = true;
  } catch (err) {
    console.error('AVIF conversion error:', err);
  }

  const success = webpSuccess && avifSuccess;
  if (!success && options.throwOnError) {
    throw new Error('Image conversion failed for one or more formats.');
  }

  return { success, webpSuccess, avifSuccess };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  convertImages()
    .then((res) => {
      if (!res.success) {
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Conversion failed:', err);
      process.exit(1);
    });
}
