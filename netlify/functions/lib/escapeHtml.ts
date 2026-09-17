/**
 * Escapes HTML entity special characters in a string to prevent HTML injection and email XSS.
 * Converts &, <, >, ", and ' to their corresponding HTML entity representations.
 */
export function escapeHtml(str?: unknown): string {
  if (typeof str !== 'string') {
    return '';
  }
  return String(str).replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return match;
    }
  });
}
