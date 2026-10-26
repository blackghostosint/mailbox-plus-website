import { describe, it, expect, beforeEach, vi } from 'vitest';
import { verifyCheckoutSession } from '../verify-session';
import { apiFetch, ApiClientError } from '../api-client';
import { ZodError } from 'zod';

vi.mock('../api-client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api-client')>();
  return {
    ...actual,
    apiFetch: vi.fn(),
  };
});

describe('verifyCheckoutSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches checkout session and parses successful session response', async () => {
    const mockSuccessResponse = {
      ok: true as const,
      data: {
        tier: 'small_mail_only',
        product: 'Small Mailbox (Mail Only)',
        amount: 1500,
        currency: 'usd',
      },
    };

    vi.mocked(apiFetch).mockResolvedValue(mockSuccessResponse);

    const sessionId = 'cs_test_a1b2c3d4e5f6g7';
    const result = await verifyCheckoutSession(sessionId);

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(apiFetch).toHaveBeenCalledWith(
      '/.netlify/functions/verify-session?session_id=' + sessionId
    );
    expect(result).toEqual(mockSuccessResponse);
  });

  it('encodes special characters in session ID parameter for query string', async () => {
    const mockSuccessResponse = {
      ok: true as const,
      data: {
        tier: null,
        product: 'Custom Service',
        amount: 2500,
        currency: 'usd',
      },
    };

    vi.mocked(apiFetch).mockResolvedValue(mockSuccessResponse);

    const rawSessionId = 'cs_test_12345 & param=value#fragment';
    await verifyCheckoutSession(rawSessionId);

    expect(apiFetch).toHaveBeenCalledTimes(1);
    expect(apiFetch).toHaveBeenCalledWith(
      '/.netlify/functions/verify-session?session_id=' + encodeURIComponent(rawSessionId)
    );
  });

  it('throws ZodError when API response fails VerifySessionSuccessSchema validation', async () => {
    const invalidResponseBody = {
      ok: false,
      error: 'Session expired or not found',
    };

    vi.mocked(apiFetch).mockResolvedValue(invalidResponseBody);

    await expect(verifyCheckoutSession('cs_test_expired123')).rejects.toThrow(ZodError);
  });

  it('throws ZodError when response data contains invalid field types', async () => {
    const malformedDataResponse = {
      ok: true,
      data: {
        tier: 'small_mail_only',
        product: 'Small Mailbox',
        amount: 'not_a_number', // Expecting a number
        currency: 'usd',
      },
    };

    vi.mocked(apiFetch).mockResolvedValue(malformedDataResponse);

    await expect(verifyCheckoutSession('cs_test_malformed')).rejects.toThrow(ZodError);
  });

  it('propagates ApiClientError when apiFetch rejects with HTTP or timeout error', async () => {
    const apiError = new ApiClientError('HTTP error 404', {
      status: 404,
      data: { error: 'Not Found' },
    });
    vi.mocked(apiFetch).mockRejectedValue(apiError);

    await expect(verifyCheckoutSession('cs_test_nonexistent')).rejects.toThrow(ApiClientError);
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });
});
