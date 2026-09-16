import { describe, it, expect, vi } from 'vitest';
import { withCors, withWebCors, DEFAULT_CORS_HEADERS } from './cors';
import type { HandlerEvent, HandlerContext } from '@netlify/functions';

describe('CORS Middleware Utility', () => {
  describe('withCors (Lambda Handler)', () => {
    const mockContext: HandlerContext = {} as any;

    it('returns HTTP 204 with CORS headers for OPTIONS requests', async () => {
      const innerHandler = vi.fn();
      const wrapped = withCors(innerHandler);

      const event: HandlerEvent = {
        httpMethod: 'OPTIONS',
      } as any;

      const res = await wrapped(event, mockContext);

      expect(innerHandler).not.toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res!.statusCode).toBe(204);
      expect(res!.headers).toMatchObject(DEFAULT_CORS_HEADERS);
      expect(res!.body).toBe('');
    });

    it('attaches default CORS and Content-Type headers to success responses', async () => {
      const innerHandler = vi.fn().mockResolvedValue({
        statusCode: 200,
        headers: {
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ message: 'Success' }),
      });

      const wrapped = withCors(innerHandler);
      const event: HandlerEvent = { httpMethod: 'GET' } as any;

      const res = await wrapped(event, mockContext);

      expect(innerHandler).toHaveBeenCalledWith(event, mockContext);
      expect(res!.statusCode).toBe(200);
      expect(res!.headers).toMatchObject({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      });
    });

    it('preserves existing custom Content-Type header if provided by inner handler', async () => {
      const innerHandler = vi.fn().mockResolvedValue({
        statusCode: 200,
        headers: {
          'content-type': 'text/plain',
        },
        body: 'Hello World',
      });

      const wrapped = withCors(innerHandler);
      const event: HandlerEvent = { httpMethod: 'GET' } as any;

      const res = await wrapped(event, mockContext);

      expect(res!.headers).toHaveProperty('content-type', 'text/plain');
      expect(res!.headers).not.toHaveProperty('Content-Type');
      expect(res!.headers).toHaveProperty('Access-Control-Allow-Origin', '*');
    });

    it('catches unhandled thrown errors and returns sanitized HTTP 500 JSON response with CORS headers', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const innerHandler = vi.fn().mockRejectedValue(new Error('Database error'));

      const wrapped = withCors(innerHandler);
      const event: HandlerEvent = { httpMethod: 'POST' } as any;

      const res = await wrapped(event, mockContext);

      expect(res!.statusCode).toBe(500);
      expect(res!.headers).toMatchObject({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      expect(JSON.parse(res!.body || '{}')).toEqual({ error: 'Internal server error' });

      consoleErrorSpy.mockRestore();
    });

    it('respects custom CorsOptions provided to withCors', async () => {
      const innerHandler = vi.fn().mockResolvedValue({ statusCode: 200, body: '{}' });
      const wrapped = withCors(innerHandler, {
        allowOrigin: 'https://mailboxplusohio.com',
      });

      const event: HandlerEvent = { httpMethod: 'POST' } as any;
      const res = await wrapped(event, mockContext);

      expect(res!.headers).toHaveProperty(
        'Access-Control-Allow-Origin',
        'https://mailboxplusohio.com'
      );
    });
  });

  describe('withWebCors (Web Standard Handler)', () => {
    it('returns HTTP 204 with CORS headers for OPTIONS requests', async () => {
      const innerHandler = vi.fn();
      const wrapped = withWebCors(innerHandler);

      const request = new Request('https://example.com/api/test', { method: 'OPTIONS' });
      const res = await wrapped(request, {});

      expect(innerHandler).not.toHaveBeenCalled();
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization, X-Requested-With'
      );
    });

    it('attaches default CORS and Content-Type headers to Web Standard responses', async () => {
      const innerHandler = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Netlify-CDN-Cache-Control': 'max-age=3600' },
        })
      );

      const wrapped = withWebCors(innerHandler);
      const request = new Request('https://example.com/api/test', { method: 'GET' });

      const res = await wrapped(request, {});

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Netlify-CDN-Cache-Control')).toBe('max-age=3600');
    });

    it('catches thrown errors in Web Standard handlers and returns status 500 JSON response', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const innerHandler = vi.fn().mockRejectedValue(new Error('Fatal edge error'));

      const wrapped = withWebCors(innerHandler);
      const request = new Request('https://example.com/api/test', { method: 'GET' });

      const res = await wrapped(request, {});

      expect(res.status).toBe(500);
      expect(res.headers.get('Content-Type')).toBe('application/json');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');

      const body = await res.json();
      expect(body).toEqual({ error: 'Internal server error' });

      consoleErrorSpy.mockRestore();
    });
  });
});
