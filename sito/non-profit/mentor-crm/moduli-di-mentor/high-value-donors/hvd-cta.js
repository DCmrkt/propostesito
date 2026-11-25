// Keep the shapes visible while the banner moves through the viewport.
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
  let pending = false;
  let needsMeasure = true;
  let lastProgress = null;
  let withinRange = !('IntersectionObserver' in window);

  function measure(rect) {
    const content = wrap.getBoundingClientRect();
    const action = button.getBoundingClientRect();
    const stacked = getComputedStyle(wrap).flexDirection === 'column';
    const small = window.innerWidth <= 760;
    const goldSize = small ? 340 : 460;
    const contentBottom = content.bottom - rect.top;
    const buttonLeft = action.left - rect.left;
    const buttonRight = action.right - rect.left;
    const buttonCenter = (action.top + action.bottom) / 2 - rect.top;

    // Bottom accents stay below the entire content block, never under white copy.
    section.style.setProperty('--cta-foam-top', `${contentBottom + 58}px`);
    section.style.setProperty('--cta-blush-top', `${contentBottom + 8}px`);
    section.style.setProperty('--cta-blush-left', `${stacked ? rect.width - 220 : buttonLeft - 200}px`);
    section.style.setProperty('--cta-gold-left', `${stacked ? rect.width - 230 : buttonRight - 165}px`);
    section.style.setProperty('--cta-gold-top', `${stacked ? contentBottom + 34 - goldSize * .30 : buttonCenter - goldSize * .88}px`);
    needsMeasure = false;
  }

  function paint() {
    pending = false;
    const rect = section.getBoundingClientRect();
    if (needsMeasure) measure(rect);
    // 0 at the first visible pixel; 1 only when the last pixel leaves the top.
    const progress = reducedMotion.matches ? .55 : clamp((window.innerHeight - rect.top) / Math.max(1, window.innerHeight + rect.height));
    // Scrolling elsewhere must not repaint the large, already-settled shapes.
    if (progress === lastProgress) return;
    lastProgress = progress;
    section.dataset.ctaProgress = progress.toFixed(3);

    const travel = progress - .5;
    shapes[0].style.transform = `translate3d(${260 * travel}px, ${-80 * travel}px, 0) scale(${1 + .10 * progress})`;
    shapes[1].style.transform = `translate3d(${-120 * travel}px, ${-95 * travel}px, 0) rotate(${-16 + 32 * progress}deg) scale(${.94 + .12 * progress})`;
    shapes[2].style.transform = `translate3d(${-150 * travel}px, ${-50 * travel}px, 0) rotate(${-30 + 80 * progress}deg) scale(${.9 + .2 * progress})`;
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
    if (withinRange && !reducedMotion.matches) requestPaint();
  }, { passive: true });
  window.addEventListener('resize', refreshGeometry);
  window.addEventListener('pageshow', refreshGeometry);
  reducedMotion.addEventListener('change', requestPaint);
  if ('ResizeObserver' in window) new ResizeObserver(refreshGeometry).observe(wrap);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      withinRange = entry.isIntersecting;
      if (withinRange) requestPaint();
    }, { rootMargin: '100px 0px' }).observe(section);
  }
  paint();
})();
