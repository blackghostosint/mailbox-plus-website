import { describe, it, expect } from 'vitest';
import { escapeHtml } from './escapeHtml.js';

describe('escapeHtml (shared utility)', () => {
  it('escapes special HTML characters (&, <, >, ", \') into corresponding HTML entities', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
      '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
    );
    expect(escapeHtml("It's a 'test'")).toBe('It&#39;s a &#39;test&#39;');
  });

  it('prevents HTML attribute breakout payloads', () => {
    expect(escapeHtml('" onclick="alert(1)"')).toBe('&quot; onclick=&quot;alert(1)&quot;');
    expect(escapeHtml("'><script>alert(1)</script>")).toBe(
      '&#39;&gt;&lt;script&gt;alert(1)&lt;/script&gt;'
    );
    expect(escapeHtml('image.png" onerror="alert(1)')).toBe(
      'image.png&quot; onerror=&quot;alert(1)'
    );
  });

  it('does not double-escape existing valid HTML entities', () => {
    expect(escapeHtml('Tom &amp; Jerry')).toBe('Tom &amp; Jerry');
    expect(escapeHtml('5 &lt; 10 &gt; 2')).toBe('5 &lt; 10 &gt; 2');
    expect(escapeHtml('&quot;quoted&quot; and &#39;single&#39;')).toBe(
      '&quot;quoted&quot; and &#39;single&#39;'
    );
    expect(escapeHtml('Hex &#x27; and &#123; and &nbsp;')).toBe('Hex &#x27; and &#123; and &nbsp;');
  });

  it('coerces non-null primitives (numbers, booleans) to valid string representations', () => {
    expect(escapeHtml(12345)).toBe('12345');
    expect(escapeHtml(0)).toBe('0');
    expect(escapeHtml(true)).toBe('true');
    expect(escapeHtml(false)).toBe('false');
  });

  it('evaluates null and undefined inputs to empty string', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });
});
