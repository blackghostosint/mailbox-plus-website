#!/usr/bin/env node
/**
 * check-astro-staged.mjs
 * Runs Astro type checking specifically scoped to staged .astro files passed by lint-staged.
 *
 * Ensures staged .astro files pass type check before commit while preventing
 * unrelated existing diagnostics in unstaged files from blocking commits.
 */

import { AstroCheck } from '@astrojs/language-server';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export async function checkAstroStaged(args, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const astroDir = options.astroDir || path.resolve(rootDir, 'astro');

  const stagedAstroPaths = new Set(
    args.filter((file) => file.endsWith('.astro')).map((file) => path.resolve(rootDir, file))
  );

  if (stagedAstroPaths.size === 0) {
    return {
      success: true,
      stagedCount: 0,
      stagedErrorsCount: 0,
      errorOutputs: [],
      message: 'No staged .astro files to check.',
    };
  }

  const require = createRequire(import.meta.url);
  const checker = new AstroCheck(astroDir, require.resolve('typescript'));
  const res = await checker.lint({ logErrors: false });

  let stagedErrorsCount = 0;
  const errorOutputs = [];

  for (const item of res.fileResult || []) {
    if (!item.fileUrl) continue;
    let itemPath;
    try {
      itemPath = path.resolve(fileURLToPath(item.fileUrl));
    } catch {
      continue;
    }

    if (stagedAstroPaths.has(itemPath)) {
      const text = item.text || '';
      const hasError =
        text.includes('\x1B[91merror\x1B[0m') ||
        text.includes('- error') ||
        /error ts\(\d+\):/.test(text) ||
        /\bError\b/.test(text);

      if (hasError) {
        stagedErrorsCount++;
        errorOutputs.push(text);
      }
    }
  }

  return {
    success: stagedErrorsCount === 0,
    stagedCount: stagedAstroPaths.size,
    stagedErrorsCount,
    errorOutputs,
    message:
      stagedErrorsCount === 0
        ? `✓ Astro type check passed for ${stagedAstroPaths.size} staged file(s).`
        : `✖ Found type errors in ${stagedErrorsCount} staged Astro file(s).`,
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  const args = process.argv.slice(2);
  const result = await checkAstroStaged(args);
  if (!result.success) {
    console.error(`\n${result.message}\n`);
    for (const errText of result.errorOutputs) {
      console.error(errText);
    }
    process.exit(1);
  } else {
    console.log(result.message);
    process.exit(0);
  }
}
