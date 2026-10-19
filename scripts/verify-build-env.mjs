import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CANONICAL_R2_BASE_URL = 'https://pub-21518ce3034449a3a7b5a0b89551f710.r2.dev';

export function parseDotenvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      env[match[1]] = val;
    }
  }
  return env;
}

export function validateBuildEnv(options = {}) {
  const env = options.env || process.env;
  const isProduction =
    options.isProduction !== undefined
      ? options.isProduction
      : env.NODE_ENV === 'production' ||
        env.CONTEXT === 'production' ||
        env.VITE_NETLIFY_CONTEXT === 'production' ||
        env.CI === 'true' ||
        process.argv.includes('--production') ||
        process.argv.includes('--prod') ||
        process.env.npm_lifecycle_event === 'build' ||
        process.env.npm_lifecycle_event === 'prebuild';

  const errors = [];
  const warnings = [];

  // Secret hygiene checks
  if (env.VITE_GEMINI_API_KEY) {
    errors.push(
      'Secret hygiene violation: GEMINI_API_KEY must not be exposed to client via VITE_ prefix.'
    );
  }
  if (env.VITE_RECAPTCHA_SECRET_KEY) {
    errors.push(
      'Secret hygiene violation: RECAPTCHA_SECRET_KEY must not be exposed to client via VITE_ prefix.'
    );
  }

  // Validate VITE_R2_PUBLIC_BASE_URL
  const r2Url = env.VITE_R2_PUBLIC_BASE_URL;
  if (!r2Url || r2Url.trim() === '') {
    if (isProduction) {
      errors.push('Missing required variable: VITE_R2_PUBLIC_BASE_URL');
    } else {
      warnings.push(
        `VITE_R2_PUBLIC_BASE_URL is missing. Local development fallback: ${CANONICAL_R2_BASE_URL}`
      );
    }
  } else {
    const trimmedUrl = r2Url.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      errors.push(
        `Invalid VITE_R2_PUBLIC_BASE_URL: "${r2Url}". Must start with http:// or https://`
      );
    }
  }

  // Validate RECAPTCHA_SITE_KEY / VITE_RECAPTCHA_SITE_KEY
  const recaptchaKey = env.VITE_RECAPTCHA_SITE_KEY || env.RECAPTCHA_SITE_KEY;
  if (
    !recaptchaKey ||
    recaptchaKey.trim() === '' ||
    recaptchaKey.toLowerCase().includes('your_recaptcha_site_key_here')
  ) {
    if (isProduction) {
      errors.push('Missing required variable: VITE_RECAPTCHA_SITE_KEY or RECAPTCHA_SITE_KEY');
    } else {
      warnings.push(
        'VITE_RECAPTCHA_SITE_KEY / RECAPTCHA_SITE_KEY is missing or placeholder. reCAPTCHA forms will omit site keys in dev mode.'
      );
    }
  }

  return {
    success: errors.length === 0,
    isProduction,
    errors,
    warnings,
  };
}

export function runPreBuildCheck(options = {}) {
  const startTime = performance.now();

  const rootDir = options.rootDir || process.cwd();
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const fileEnv = parseDotenvFile(envPath);
    for (const [k, v] of Object.entries(fileEnv)) {
      if (!process.env[k]) {
        process.env[k] = v;
      }
    }
  }

  const result = validateBuildEnv(options);
  const duration = (performance.now() - startTime).toFixed(2);

  if (result.warnings.length > 0) {
    console.log(`ℹ️ [pre-build env] Notices (${duration}ms):`);
    for (const w of result.warnings) {
      console.log(`   - ${w}`);
    }
  }

  if (!result.success) {
    console.error(`❌ Pre-build environment validation failed (${duration}ms):`);
    for (const err of result.errors) {
      console.error(`   - ${err}`);
    }
    if (options.exitOnError !== false) {
      process.exit(1);
    }
  } else {
    console.log(
      `✅ Pre-build environment check passed (${duration}ms). Mode: ${result.isProduction ? 'production' : 'development'}`
    );
  }

  return result;
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  runPreBuildCheck();
}
