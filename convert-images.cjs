const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const INPUT_FILE = path.resolve(__dirname, 'logo.png');
const WEBP_OUTPUT = path.resolve(__dirname, 'public', 'logo.webp');
const AVIF_OUTPUT = path.resolve(__dirname, 'public', 'logo.avif');

function getSharp() {
  try {
    return require('sharp');
  } catch (_err) {
    try {
      const astroPackagePath = path.resolve(__dirname, 'astro', 'package.json');
      const astroRequire = createRequire(astroPackagePath);
      return astroRequire('sharp');
    } catch (fallbackErr) {
      throw new Error(`Failed to resolve 'sharp' module: ${fallbackErr.message}`);
    }
  }
}

async function convertImages(options = {}) {
  const input = options.input || INPUT_FILE;
  const webpOutput = options.webpOutput || WEBP_OUTPUT;
  const avifOutput = options.avifOutput || AVIF_OUTPUT;

  if (!fs.existsSync(input)) {
    const errorMsg = `Error: Source image '${input}' does not exist.`;
    console.error(errorMsg);
    process.exitCode = 1;
    throw new Error(errorMsg);
  }

  let sharp;
  try {
    sharp = getSharp();
  } catch (err) {
    console.error('Error loading sharp:', err.message);
    process.exitCode = 1;
    throw err;
  }

  try {
    const webpPromise = sharp(input).webp({ quality: 80 }).toFile(webpOutput);
    const avifPromise = sharp(input).avif({ quality: 80 }).toFile(avifOutput);

    const results = await Promise.all([webpPromise, avifPromise]);
    console.log(`Converted to WebP: ${webpOutput}`);
    console.log(`Converted to AVIF: ${avifOutput}`);
    return results;
  } catch (err) {
    console.error('Image conversion failed:', err);
    process.exitCode = 1;
    throw err;
  }
}

if (require.main === module) {
  convertImages().catch(() => {
    // Error is already logged and process.exitCode is set to 1
  });
}

module.exports = {
  convertImages,
  INPUT_FILE,
  WEBP_OUTPUT,
  AVIF_OUTPUT,
};
