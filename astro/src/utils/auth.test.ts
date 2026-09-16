import process from 'node:process';
import { describe, it, expect, vi } from 'vitest';
import { generateCustomerToken, verifyCustomerToken } from '../../../netlify/functions/lib/auth';

describe('auth.ts session token handling', () => {
  it('generates and verifies valid customer tokens', () => {
    const token = generateCustomerToken('cust_123');
    expect(typeof token).toBe('string');
    expect(verifyCustomerToken(token, 'cust_123')).toBe(true);
  });

  it('rejects token verification for mismatched customer IDs', () => {
    const token = generateCustomerToken('cust_123');
    expect(verifyCustomerToken(token, 'cust_456')).toBe(false);
  });

  it('rejects token verification for tampered token signatures', () => {
    const token = generateCustomerToken('cust_123');
    const tampered = token.slice(0, -5) + 'xxxxx';
    expect(verifyCustomerToken(tampered, 'cust_123')).toBe(false);
  });

  it('throws an error at module load when SESSION_SECRET is missing', async () => {
    vi.resetModules();
    const originalSessionSecret = process.env.SESSION_SECRET;
    const originalJwtSecret = process.env.JWT_SECRET;
    delete process.env.SESSION_SECRET;
    delete process.env.JWT_SECRET;

    try {
      await expect(import('../../../netlify/functions/lib/auth')).rejects.toThrow(
        'SESSION_SECRET environment variable is missing'
      );
    } finally {
      if (originalSessionSecret) process.env.SESSION_SECRET = originalSessionSecret;
      if (originalJwtSecret) process.env.JWT_SECRET = originalJwtSecret;
      vi.resetModules();
    }
  });
});
