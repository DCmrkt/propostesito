(() => {
  if (!('IntersectionObserver' in window)) return;

  const visiblePart = .3;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.toggleAttribute('data-in-view', entry.intersectionRatio >= visiblePart);
    }
  }, { threshold: visiblePart });
  document.querySelectorAll('[data-motion], [data-scroll-motion]').forEach(shot => observer.observe(shot));
})();
