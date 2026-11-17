// Enhance the anchor links without hiding any feature copy from the HTML.
(() => {
  const section = document.querySelector('#come-funziona');
  if (!section) return;
  const track = section.querySelector('.hvd-feature-list');
  const links = [...section.querySelectorAll('.hvd-feature-nav a')];
  const panels = links.map(link => document.getElementById(link.hash.slice(1)));
  if (!track || panels.some(panel => !panel)) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function currentIndex() {
    const left = track.getBoundingClientRect().left;
    return panels.reduce((nearest, panel, index) =>
      Math.abs(panel.getBoundingClientRect().left - left) <
      Math.abs(panels[nearest].getBoundingClientRect().left - left) ? index : nearest, 0);
  }

  function updateSelection() {
    const current = currentIndex();
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function showPanel(index) {
    const left = track.scrollLeft + panels[index].getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    // Preserve open-in-new-tab and other modified link actions.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPanel(index);
    panels[index].focus({ preventScroll: true });
  }));

  track.addEventListener('keydown', event => {
    // The site lets users edit copy. Do not intercept keys in those fields.
    if (event.target !== track) return;
    let index = currentIndex();
    if (event.key === 'ArrowRight') index = Math.min(index + 1, panels.length - 1);
    else if (event.key === 'ArrowLeft') index = Math.max(index - 1, 0);
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = panels.length - 1;
    else return;
    event.preventDefault();
    showPanel(index);
  });

  let scheduled = false;
  track.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; updateSelection(); });
  }, { passive: true });
  new ResizeObserver(updateSelection).observe(track);
  window.addEventListener('hashchange', updateSelection);
  window.addEventListener('load', updateSelection, { once: true });
  updateSelection();
})();
