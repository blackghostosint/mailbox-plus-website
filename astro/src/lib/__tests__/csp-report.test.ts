import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sendCspReport } from '../csp-report';
import { apiFetch } from '../api-client';
import type { CspReportRequest } from '../contracts';
import { ZodError } from 'zod';

vi.mock('../api-client', () => ({
  apiFetch: vi.fn(),
}));

describe('sendCspReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates and sends legacy csp-report wrapper payload via apiFetch POST', async () => {
    vi.mocked(apiFetch).mockResolvedValue(null);

    const legacyReport = {
      'csp-report': {
        'document-uri': 'https://example.com/page',
        'violated-directive': 'script-src',
        'blocked-uri': 'https://evil.com/malicious.js',
        'line-number': 42,
        'column-number': 12,
      },
    };

    await sendCspReport(legacyReport);

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(apiFetch).toHaveBeenCalledWith('/.netlify/functions/csp-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(legacyReport),
    });
  });

  it('validates and sends modern CSP report array payload via apiFetch POST', async () => {
    vi.mocked(apiFetch).mockResolvedValue(null);

    const modernReportArray = [
      {
        type: 'csp-violation',
        age: 10,
        url: 'https://example.com/login',
        user_agent: 'Mozilla/5.0',
        body: {
          documentURL: 'https://example.com/login',
          violatedDirective: 'connect-src',
          blockedURL: 'https://analytics.com',
        },
      },
    ];

    await sendCspReport(modernReportArray);

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(apiFetch).toHaveBeenCalledWith('/.netlify/functions/csp-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modernReportArray),
    });
  });

  it('validates and sends single modern report item object via apiFetch POST', async () => {
    vi.mocked(apiFetch).mockResolvedValue(null);

    const modernItem = {
      type: 'csp-violation',
      url: 'https://example.com/dashboard',
      body: {
        documentUri: 'https://example.com/dashboard',
        blockedUri: 'http://insecure.com',
      },
    };

    await sendCspReport(modernItem);

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(apiFetch).toHaveBeenCalledWith('/.netlify/functions/csp-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modernItem),
    });
  });

  it('validates and sends raw CSP report body object via apiFetch POST', async () => {
    vi.mocked(apiFetch).mockResolvedValue(null);

    const rawBody = {
      'document-uri': 'https://example.com/checkout',
      'violated-directive': 'img-src',
      'blocked-uri': 'http://http-image.com/pic.png',
    };

    await sendCspReport(rawBody);

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(apiFetch).toHaveBeenCalledWith('/.netlify/functions/csp-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawBody),
    });
  });

  it('throws ZodError and does not invoke apiFetch when report payload fails schema validation', async () => {
    const invalidReport = {
      unrecognizedField: 'invalid_data',
    } as unknown as CspReportRequest;

    await expect(sendCspReport(invalidReport)).rejects.toThrow(ZodError);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('throws ZodError when report array is empty', async () => {
    const emptyArrayReport = [] as unknown as CspReportRequest;

    await expect(sendCspReport(emptyArrayReport)).rejects.toThrow(ZodError);
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('propagates errors when apiFetch rejects', async () => {
    const networkError = new Error('Network error: Failed to fetch');
    vi.mocked(apiFetch).mockRejectedValue(networkError);

    const validReport = {
      'csp-report': {
        'document-uri': 'https://example.com',
      },
    };

    await expect(sendCspReport(validReport)).rejects.toThrow('Network error: Failed to fetch');
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });
});
