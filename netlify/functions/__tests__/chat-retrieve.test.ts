import { describe, it, expect, vi } from 'vitest';
import { handler } from '../chat-retrieve';

describe('chat-retrieve Netlify function', () => {
  it('returns 405 for disallowed HTTP methods', async () => {
    const event = {
      httpMethod: 'PUT',
      path: '/.netlify/functions/chat-retrieve',
      headers: {},
      body: null,
    } as any;

    const res = await handler(event, {} as any, () => {});
    expect(res?.statusCode).toBe(405);
    const body = JSON.parse(res?.body as string);
    expect(body.type).toBe('refuse');
    expect(body.reason).toBe('method_not_allowed');
  });

  it('returns 400 for missing request body', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/.netlify/functions/chat-retrieve',
      headers: { 'content-type': 'application/json' },
      body: null,
    } as any;

    const res = await handler(event, {} as any, () => {});
    expect(res?.statusCode).toBe(400);
    const body = JSON.parse(res?.body as string);
    expect(body.type).toBe('refuse');
    expect(body.reason).toBe('missing_body');
  });

  it('returns 400 for invalid JSON body', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/.netlify/functions/chat-retrieve',
      headers: { 'content-type': 'application/json' },
      body: 'invalid-json',
    } as any;

    const res = await handler(event, {} as any, () => {});
    expect(res?.statusCode).toBe(400);
    const body = JSON.parse(res?.body as string);
    expect(body.type).toBe('refuse');
    expect(body.reason).toBe('invalid_json_body');
  });

  it('returns 400 for empty or invalid question', async () => {
    const event = {
      httpMethod: 'POST',
      path: '/.netlify/functions/chat-retrieve',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: '   ' }),
    } as any;

    const res = await handler(event, {} as any, () => {});
    expect(res?.statusCode).toBe(400);
    const body = JSON.parse(res?.body as string);
    expect(body.type).toBe('refuse');
    expect(body.reason).toBe('invalid_question');
  });

  it('returns 400 for question exceeding max length', async () => {
    const longQuestion = 'a'.repeat(501);
    const event = {
      httpMethod: 'POST',
      path: '/.netlify/functions/chat-retrieve',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: longQuestion }),
    } as any;

    const res = await handler(event, {} as any, () => {});
    expect(res?.statusCode).toBe(400);
    const body = JSON.parse(res?.body as string);
    expect(body.type).toBe('refuse');
    expect(body.reason).toBe('question_too_long');
  });
});
