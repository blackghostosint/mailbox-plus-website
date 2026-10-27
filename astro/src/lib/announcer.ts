// Lightweight screen reader live region announcement module.

let politeMessage = '';
let assertiveMessage = '';
let politeTimeout: ReturnType<typeof setTimeout> | null = null;
let assertiveTimeout: ReturnType<typeof setTimeout> | null = null;

export function getPoliteElement(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById('live-announcer-polite');
}

export function getAssertiveElement(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById('live-announcer-assertive');
}

export function announcePolite(message: string): void {
  politeMessage = '';
  const el = getPoliteElement();
  if (el) {
    el.textContent = '';
  }
  if (politeTimeout) clearTimeout(politeTimeout);
  politeTimeout = setTimeout(() => {
    politeMessage = message;
    const target = getPoliteElement();
    if (target) {
      target.textContent = message;
    }
  }, 50);
}

export function announceAssertive(message: string): void {
  assertiveMessage = '';
  const el = getAssertiveElement();
  if (el) {
    el.textContent = '';
  }
  if (assertiveTimeout) clearTimeout(assertiveTimeout);
  assertiveTimeout = setTimeout(() => {
    assertiveMessage = message;
    const target = getAssertiveElement();
    if (target) {
      target.textContent = message;
    }
  }, 50);
}

export function getPoliteMessage(): string {
  return politeMessage;
}

export function getAssertiveMessage(): string {
  return assertiveMessage;
}

export function cancelPendingAnnouncements(): void {
  if (politeTimeout) {
    clearTimeout(politeTimeout);
    politeTimeout = null;
  }
  if (assertiveTimeout) {
    clearTimeout(assertiveTimeout);
    assertiveTimeout = null;
  }
}

export function resetAnnouncer(): void {
  cancelPendingAnnouncements();
  politeMessage = '';
  assertiveMessage = '';
  const politeEl = getPoliteElement();
  if (politeEl) politeEl.textContent = '';
  const assertiveEl = getAssertiveElement();
  if (assertiveEl) assertiveEl.textContent = '';
}
