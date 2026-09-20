import { describe, it, expect } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  parseDocumentedVars,
  parseEnvExampleVars,
  scanCodebaseForEnvVars,
  checkEnvDocs,
} from '../verify/check-env-docs.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

describe('check-env-docs', () => {
  it('parses environment variables from docs/ENVIRONMENT.md', () => {
    const docPath = path.join(ROOT, 'docs', 'ENVIRONMENT.md');
    const vars = parseDocumentedVars(docPath);

    expect(vars.has('VITE_R2_PUBLIC_BASE_URL')).toBe(true);
    expect(vars.has('STRIPE_SECRET_KEY')).toBe(true);
    expect(vars.has('RECAPTCHA_SECRET_KEY')).toBe(true);
    expect(vars.has('GOOGLE_PLACES_API_KEY')).toBe(true);
  });

  it('parses environment variables from .env.example', () => {
    const examplePath = path.join(ROOT, '.env.example');
    const vars = parseEnvExampleVars(examplePath);

    expect(vars.has('VITE_R2_PUBLIC_BASE_URL')).toBe(true);
    expect(vars.has('STRIPE_SECRET_KEY')).toBe(true);
    expect(vars.has('RECAPTCHA_SECRET_KEY')).toBe(true);
  });

  it('scans codebase for environment variable usages', () => {
    const dirs = [path.join(ROOT, 'netlify', 'functions')];
    const usages = scanCodebaseForEnvVars(dirs);

    expect(usages.has('STRIPE_SECRET_KEY')).toBe(true);
    expect(usages.get('STRIPE_SECRET_KEY')?.size).toBeGreaterThan(0);
  });

  it('passes environment verification on the synchronized repository', () => {
    const success = checkEnvDocs();
    expect(success).toBe(true);
  });
});
