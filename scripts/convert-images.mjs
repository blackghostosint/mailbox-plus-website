#!/usr/bin/env node
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainModule, parseScriptArgs } from './lib/cli-utils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const convertImagesCjs = require(path.resolve(__dirname, '../convert-images.cjs'));

export const convertImages = convertImagesCjs.convertImages;
export const INPUT_FILE = convertImagesCjs.INPUT_FILE;
export const WEBP_OUTPUT = convertImagesCjs.WEBP_OUTPUT;
export const AVIF_OUTPUT = convertImagesCjs.AVIF_OUTPUT;

if (isMainModule(import.meta)) {
  parseScriptArgs();
  convertImages().catch(() => {
    // Error logged and process.exitCode set in convertImages
  });
}
