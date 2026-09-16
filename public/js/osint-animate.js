(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sections = document.querySelectorAll('.osint-page section[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08 }
  );
  for (const section of sections) {
    section.classList.add('section-hidden');
    observer.observe(section);
  }
})();
