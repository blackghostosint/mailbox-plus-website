import { describe, it, expect } from 'vitest';
import { escapeHtml } from './escapeHtml';

describe('escapeHtml', () => {
  it('escapes special HTML characters accurately', () => {
    expect(escapeHtml('<')).toBe('&lt;');
    expect(escapeHtml('>')).toBe('&gt;');
    expect(escapeHtml('&')).toBe('&amp;');
    expect(escapeHtml('"')).toBe('&quot;');
    expect(escapeHtml("'")).toBe('&#39;');
  });

  it('escapes script tags and HTML injection payloads', () => {
    const maliciousInput = '<script>alert("XSS & Injection")</script>';
    const expectedOutput = '&lt;script&gt;alert(&quot;XSS &amp; Injection&quot;)&lt;/script&gt;';
    expect(escapeHtml(maliciousInput)).toBe(expectedOutput);
  });

  it('escapes attributes and single quotes', () => {
    const input = `<a href="http://example.com" onclick='alert("test")'>Link</a>`;
    const expected = `&lt;a href=&quot;http://example.com&quot; onclick=&#39;alert(&quot;test&quot;)&#39;&gt;Link&lt;/a&gt;`;
    expect(escapeHtml(input)).toBe(expected);
  });

  it('preserves standard plain text without HTML special characters', () => {
    const plainText = 'John Doe (440) 555-0123 help@mailboxplusohio.com';
    expect(escapeHtml(plainText)).toBe(plainText);
  });

  it('handles empty strings, null, and undefined gracefully', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('handles numeric and boolean values by returning empty string', () => {
    expect(escapeHtml(12345 as any)).toBe('');
    expect(escapeHtml(true as any)).toBe('');
  });
});
