// Reveal the existing header shapes as the CTA travels into view.
(() => {
  const section = document.querySelector('.hvd-cta');
  const wrap = section?.querySelector('.wrap');
  const button = section?.querySelector('.dc-button');
  const source = document.querySelector('.hvd-hero .hero-blobs');
  if (!section || !wrap || !button || !source || section.querySelector('.hvd-cta-art')) return;

  const names = ['foam', 'gold', 'blush'];
  const originals = names.map(name => source.querySelector(`.is-${name}`));
  if (originals.some(shape => !shape)) return;

  const art = document.createElement('div');
  art.className = 'hvd-cta-art';
  art.setAttribute('aria-hidden', 'true');
  art.setAttribute('data-no-edit', '');
  const shapes = originals.map((original, index) => {
    const shape = original.cloneNode(true);
    shape.removeAttribute('style');
    shape.removeAttribute('id');
    [...shape.attributes].forEach(attribute => {
      if (attribute.name.startsWith('data-')) shape.removeAttribute(attribute.name);
    });
    shape.setAttribute('class', `hvd-cta-shape hvd-cta-shape--${names[index]}`);
    shape.setAttribute('focusable', 'false');
    art.append(shape);
    return shape;
  });
  section.prepend(art);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const phase = (value, start, end) => {
    const t = clamp((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  };
  let pending = false;
  let needsMeasure = true;

  function measure(rect) {
    const content = wrap.getBoundingClientRect();
    const action = button.getBoundingClientRect();
    const stacked = getComputedStyle(wrap).flexDirection === 'column';
    const small = window.innerWidth <= 760;
    const goldSize = small ? 190 : 220;
    const contentBottom = content.bottom - rect.top;
    const buttonLeft = action.left - rect.left;
    const buttonRight = action.right - rect.left;
    const buttonCenter = (action.top + action.bottom) / 2 - rect.top;

    // Bottom accents stay below the entire content block, never under white copy.
    section.style.setProperty('--cta-foam-top', `${contentBottom + 10}px`);
    section.style.setProperty('--cta-blush-top', `${contentBottom + 2}px`);
    section.style.setProperty('--cta-blush-left', `${stacked ? Math.min(rect.width - 100, buttonRight + 24) : buttonLeft - 130}px`);
    section.style.setProperty('--cta-gold-left', `${Math.min(rect.width - 145, buttonRight - 70)}px`);
    section.style.setProperty('--cta-gold-top', `${stacked ? contentBottom + 12 - goldSize * .30 : buttonCenter - 190}px`);
    needsMeasure = false;
  }

  function paint() {
    pending = false;
    const rect = section.getBoundingClientRect();
    if (needsMeasure) measure(rect);
    const start = window.innerHeight - 24;
    const end = Math.max(64, (window.innerHeight - rect.height) / 2);
    const progress = reducedMotion.matches ? 1 : clamp((start - rect.top) / Math.max(1, start - end));
    section.style.setProperty('--cta-scroll-progress', progress.toFixed(4));
    section.dataset.ctaProgress = progress.toFixed(3);

    const foam = phase(progress, .06, .72);
    const gold = phase(progress, .30, .92);
    const blush = phase(progress, .54, 1);
    shapes[0].style.opacity = (foam * .9).toFixed(3);
    shapes[0].style.transform = `translate3d(${-90 * (1 - foam)}px, ${145 * (1 - foam)}px, 0) rotate(${-14 + 14 * foam}deg) scale(${.82 + .18 * foam})`;
    shapes[0].style.borderRadius = `${50 + 9 * foam}% ${50 - 9 * foam}% ${50 + 6 * foam}% ${50 - 6 * foam}% / 50% ${50 + 8 * foam}% ${50 - 8 * foam}% 50%`;
    shapes[1].style.opacity = (gold * .92).toFixed(3);
    shapes[1].style.transform = `translate3d(${145 * (1 - gold)}px, ${100 * (1 - gold)}px, 0) rotate(${-18 + 18 * gold}deg) scale(${.74 + .26 * gold})`;
    shapes[2].style.opacity = (blush * .88).toFixed(3);
    shapes[2].style.transform = `translate3d(${45 * (1 - blush)}px, ${95 * (1 - blush)}px, 0) rotate(${-12 + 24 * blush}deg) scale(${.7 + .3 * blush})`;
  }

  function requestPaint() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(paint);
  }
  function refreshGeometry() {
    needsMeasure = true;
    requestPaint();
  }
  window.addEventListener('scroll', () => {
    if (!reducedMotion.matches) requestPaint();
  }, { passive: true });
  window.addEventListener('resize', refreshGeometry);
  window.addEventListener('pageshow', refreshGeometry);
  reducedMotion.addEventListener('change', requestPaint);
  if ('ResizeObserver' in window) new ResizeObserver(refreshGeometry).observe(wrap);
  paint();
})();
