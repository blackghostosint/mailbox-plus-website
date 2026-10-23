/* global process */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  siteConfig,
  getNetlifyContext,
  getSiteDomain,
  fullAddressSingleLine,
  fullAddressMultiLine,
  phoneFormatted,
  phoneTelLink,
  storeHoursList,
  formattedHoursList,
  hoursSummary,
  defaultCTA,
} from '../siteConfig';

describe('siteConfig module', () => {
  const ENV_KEYS = [
    'VITE_NETLIFY_CONTEXT',
    'CONTEXT',
    'VITE_SITE_URL',
    'SITE_URL',
    'DEPLOY_PRIME_URL',
    'URL',
  ];

  const originalProcessEnv = { ...process.env };

  beforeEach(() => {
    // Clear out env keys for clean state before each test
    ENV_KEYS.forEach((key) => {
      vi.stubEnv(key, '');
      delete process.env[key];
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        delete import.meta.env[key];
      }
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    ENV_KEYS.forEach((key) => {
      if (originalProcessEnv[key] !== undefined) {
        process.env[key] = originalProcessEnv[key];
      } else {
        delete process.env[key];
      }
    });
  });

  describe('getNetlifyContext()', () => {
    it('returns undefined when no context environment variables are set', () => {
      expect(getNetlifyContext()).toBeUndefined();
    });

    it('evaluates VITE_NETLIFY_CONTEXT when defined', () => {
      vi.stubEnv('VITE_NETLIFY_CONTEXT', 'deploy-preview');
      expect(getNetlifyContext()).toBe('deploy-preview');
    });

    it('evaluates CONTEXT when VITE_NETLIFY_CONTEXT is not set', () => {
      vi.stubEnv('CONTEXT', 'production');
      expect(getNetlifyContext()).toBe('production');
    });

    it('prioritizes VITE_NETLIFY_CONTEXT over CONTEXT', () => {
      vi.stubEnv('VITE_NETLIFY_CONTEXT', 'branch-deploy');
      vi.stubEnv('CONTEXT', 'production');
      expect(getNetlifyContext()).toBe('branch-deploy');
    });
  });

  describe('getSiteDomain() & siteConfig.domain getter', () => {
    it('returns default canonical domain when no environment variables are set', () => {
      expect(getSiteDomain()).toBe('https://mailboxplusohio.com');
      expect(siteConfig.domain).toBe('https://mailboxplusohio.com');
    });

    it('uses VITE_SITE_URL with https prefix and removes trailing slashes', () => {
      vi.stubEnv('VITE_SITE_URL', 'https://custom-domain.com///');
      expect(getSiteDomain()).toBe('https://custom-domain.com');
      expect(siteConfig.domain).toBe('https://custom-domain.com');
    });

    it('uses SITE_URL with http prefix and removes trailing slashes', () => {
      vi.stubEnv('SITE_URL', 'http://http-domain.com/path/');
      expect(getSiteDomain()).toBe('http://http-domain.com/path');
    });

    it('automatically prepends https:// if protocol is missing from site URL', () => {
      vi.stubEnv('VITE_SITE_URL', 'noprotocol.mailboxplusohio.com');
      expect(getSiteDomain()).toBe('https://noprotocol.mailboxplusohio.com');
    });

    it('prioritizes VITE_SITE_URL over SITE_URL', () => {
      vi.stubEnv('VITE_SITE_URL', 'https://primary.com');
      vi.stubEnv('SITE_URL', 'https://secondary.com');
      expect(getSiteDomain()).toBe('https://primary.com');
    });

    it('uses DEPLOY_PRIME_URL in deploy-preview context', () => {
      vi.stubEnv('VITE_NETLIFY_CONTEXT', 'deploy-preview');
      vi.stubEnv('DEPLOY_PRIME_URL', 'https://deploy-preview-42--mailboxplus.netlify.app/');
      expect(getSiteDomain()).toBe('https://deploy-preview-42--mailboxplus.netlify.app');
      expect(siteConfig.domain).toBe('https://deploy-preview-42--mailboxplus.netlify.app');
    });

    it('uses URL in branch-deploy context if DEPLOY_PRIME_URL is missing', () => {
      vi.stubEnv('CONTEXT', 'branch-deploy');
      vi.stubEnv('URL', 'https://staging.mailboxplusohio.com/');
      expect(getSiteDomain()).toBe('https://staging.mailboxplusohio.com');
    });

    it('prepends https:// to preview URL if protocol is omitted', () => {
      vi.stubEnv('CONTEXT', 'deploy-preview');
      vi.stubEnv('DEPLOY_PRIME_URL', 'preview-123.netlify.app');
      expect(getSiteDomain()).toBe('https://preview-123.netlify.app');
    });

    it('falls back to default domain if preview context has no preview URL', () => {
      vi.stubEnv('CONTEXT', 'deploy-preview');
      expect(getSiteDomain()).toBe('https://mailboxplusohio.com');
    });

    it('ignores preview URLs if context is production and explicit site URL is not set', () => {
      vi.stubEnv('CONTEXT', 'production');
      vi.stubEnv('DEPLOY_PRIME_URL', 'https://deploy-preview-42--mailboxplus.netlify.app');
      expect(getSiteDomain()).toBe('https://mailboxplusohio.com');
    });
  });

  describe('Address, Phone, and Hours formatting utilities', () => {
    it('formats fullAddressSingleLine correctly', () => {
      expect(fullAddressSingleLine).toBe('7554 Fredle Drive, Concord Township, OH 44077');
      expect(siteConfig.fullAddressSingleLine).toBe(fullAddressSingleLine);
    });

    it('formats fullAddressMultiLine correctly', () => {
      expect(fullAddressMultiLine).toBe('7554 Fredle Drive\nConcord Township, OH 44077');
      expect(siteConfig.fullAddressMultiLine).toBe(fullAddressMultiLine);
    });

    it('formats phoneFormatted correctly', () => {
      expect(phoneFormatted).toBe('(440) 709-1946');
      expect(siteConfig.phoneFormatted).toBe(phoneFormatted);
    });

    it('formats phoneTelLink correctly', () => {
      expect(phoneTelLink).toBe('tel:4407091946');
      expect(siteConfig.phoneTelLink).toBe(phoneTelLink);
    });

    it('exports correct storeHoursList and formattedHoursList', () => {
      expect(storeHoursList).toEqual([
        'Monday - Friday: 9:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 2:00 PM',
        'Sunday: Closed',
      ]);
      expect(formattedHoursList).toEqual(storeHoursList);
      expect(siteConfig.storeHoursList).toEqual(storeHoursList);
      expect(siteConfig.formattedHoursList).toEqual(storeHoursList);
    });

    it('formats hoursSummary correctly', () => {
      expect(hoursSummary).toBe('Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM, Sun: Closed');
      expect(siteConfig.hoursSummary).toBe(hoursSummary);
    });
  });

  describe('defaultCTA', () => {
    it('contains all required fields and valid relative button link', () => {
      expect(defaultCTA.title).toBe('Ready to get started?');
      expect(defaultCTA.buttonText).toBe('Visit Us in Concord Township');
      expect(defaultCTA.buttonLink).toBe('/contact-us');
      expect(defaultCTA.variant).toBe('brand');
      expect(defaultCTA.align).toBe('center');
    });
  });
});
