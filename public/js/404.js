/* global module */
function init404() {
  // 🍪 Easter Egg — The Office cookie
  document.cookie = 'kevin_cookie=Oops! Kevin spilled this page; path=/; max-age=86400';
  console.log('🥣 Kevin’s Famous Chili: Too bad this page didn’t make it.');

  // 🎬 Random quotes from The Office
  const quotes = [
    '"Would I rather be feared or loved? Easy. Both." — Michael Scott',
    '"Sometimes I’ll start a sentence and I don’t even know where it’s going." — Michael Scott',
    '"I am Beyoncé, always." — Michael Scott',
    '"I declare BANKRUPTCY!" — Michael Scott',
    '"That’s what she said." — Michael Scott',
    '"I understand nothing." — Michael Scott',
    '"I love inside jokes. I’d love to be a part of one someday." — Michael Scott',
    '"Guess what, I have flaws. What are they? Oh, I don’t know… I sing in the shower." — Michael Scott',
  ];

  const quoteEl = document.getElementById('quote');
  const button = document.getElementById('quoteButton');

  if (quoteEl) {
    // Show one quote immediately
    quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }

  if (button && quoteEl) {
    // Change quote on button click
    button.addEventListener('click', () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      quoteEl.textContent = randomQuote;
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init404);
  } else {
    init404();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init404 };
}
if (typeof window !== 'undefined') {
  window.init404 = init404;
}
