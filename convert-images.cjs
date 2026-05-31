const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'logo.png');
const webpOutput = path.join(__dirname, 'public', 'logo.webp');
const avifOutput = path.join(__dirname, 'public', 'logo.avif');

// Convert to WebP
sharp(input)
  .webp({ quality: 80 })
  .toFile(webpOutput)
  .then(() => console.log('Converted to WebP'))
  .catch(err => console.error('WebP error:', err));

// Convert to AVIF
sharp(input)
  .avif({ quality: 80 })
  .toFile(avifOutput)
  .then(() => console.log('Converted to AVIF'))
  .catch(err => console.error('AVIF error:', err));
