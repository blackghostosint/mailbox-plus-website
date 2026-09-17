export function showToast(message: string): void {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector('.copy-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

export async function copyToClipboard(text: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied!');
      return;
    } catch {
      // Fall through to textarea fallback
    }
  }
  if (typeof document !== 'undefined') {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Copied!');
    } catch {
      showToast('Failed to copy');
    } finally {
      document.body.removeChild(ta);
    }
  }
}
