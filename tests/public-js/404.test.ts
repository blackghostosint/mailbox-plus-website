// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import mod from '../../public/js/404.js';

describe('404.js Easter Egg and Quotes', () => {
  beforeEach(() => {
    document.cookie = '';
    document.body.innerHTML = `
      <div id="quote"></div>
      <button id="quoteButton">New Quote</button>
    `;
    mod.init404();
  });

  it('sets kevin cookie on initialization', () => {
    expect(document.cookie).toContain('kevin_cookie=Oops!');
  });

  it('populates initial quote and changes quote on button click', () => {
    const quoteEl = document.getElementById('quote') as HTMLDivElement;
    const button = document.getElementById('quoteButton') as HTMLButtonElement;

    expect(quoteEl.textContent).not.toBe('');

    button.click();
    expect(quoteEl.textContent).not.toBe('');
  });
});
