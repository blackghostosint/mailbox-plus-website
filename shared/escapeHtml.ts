/**
 * Escapes special characters in a string to safe HTML entities to prevent HTML injection and XSS.
 * Converts &, <, >, ", and ' to their corresponding HTML entity representations.
 * Preserves existing valid HTML entities (e.g. &amp;, &lt;, &gt;, &quot;, &#39;, &#x27;) to prevent double escaping.
 * Coerces non-null primitive inputs (numbers, booleans) to their string representations.
 * Evaluates null and undefined inputs to an empty string "".
 */
export function escapeHtml(str?: unknown): string {
  if (str === null || str === undefined) {
    return '';
  }
  const s = typeof str === 'string' ? str : String(str);
  return s
    .replace(/&(?!(?:[a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
