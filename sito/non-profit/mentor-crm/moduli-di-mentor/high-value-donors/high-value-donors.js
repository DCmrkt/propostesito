// Enhance the anchor links without hiding any feature copy from the HTML.
(() => {
  const section = document.querySelector('#come-funziona');
  if (!section) return;
  const track = section.querySelector('.hvd-feature-list');
  const links = [...section.querySelectorAll('.hvd-feature-nav a')];
  const panels = links.map(link => document.getElementById(link.hash.slice(1)));
  if (!track || panels.some(panel => !panel)) return;
  const scene = section.querySelector('.hvd-interface-scene');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let requestedIndex = null;
  let settleTimer;
  let rotationTimer;
  let userPaused = reducedMotion.matches;
  let visible = false;
  let hovered = false;
  let focused = false;
  let pointerHeld = false;

  const rotationControl = document.createElement('button');
  rotationControl.type = 'button';
  rotationControl.className = 'hvd-slider-toggle';
  rotationControl.setAttribute('data-no-edit', '');
  if (!track.id) track.id = 'hvd-feature-track';
  rotationControl.setAttribute('aria-controls', track.id);
  const hint = section.querySelector('.hvd-slider-hint');
  if (hint) hint.insertAdjacentElement('afterend', rotationControl);
  else track.insertAdjacentElement('beforebegin', rotationControl);

  function updateRotationControl() {
    const label = userPaused ? 'Avvia la rotazione automatica' : 'Metti in pausa la rotazione automatica';
    rotationControl.setAttribute('aria-label', label);
    rotationControl.title = label;
    rotationControl.dataset.paused = String(userPaused);
    rotationControl.innerHTML = userPaused
      ? '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 10 7-10 7Z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14M16 5v14"/></svg>';
  }

  function scheduleRotation() {
    clearTimeout(rotationTimer);
    const canRotate = !userPaused && visible && !document.hidden && !hovered && !focused && !pointerHeld;
    section.dataset.autoplay = canRotate ? 'playing' : 'paused';
    if (!canRotate) return;
    rotationTimer = setTimeout(() => {
      showPanel(((requestedIndex ?? currentIndex()) + 1) % panels.length);
      scheduleRotation();
    }, 7000);
  }

  function currentIndex() {
    const left = track.getBoundingClientRect().left;
    return panels.reduce((nearest, panel, index) =>
      Math.abs(panel.getBoundingClientRect().left - left) <
      Math.abs(panels[nearest].getBoundingClientRect().left - left) ? index : nearest, 0);
  }

  function updateSelection() {
    const current = requestedIndex ?? currentIndex();
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    // Reposition the same captured UI panels; the application screen stays fixed.
    if (scene) scene.dataset.feature = panels[current].id;
  }

  function showPanel(index) {
    clearTimeout(settleTimer);
    requestedIndex = index;
    updateSelection();
    const left = track.scrollLeft + panels[index].getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    // Keep a direct selection stable while the copy passes intermediate panels.
    settleTimer = setTimeout(finishSelection, reducedMotion.matches ? 0 : 800);
  }

  function finishSelection() {
    clearTimeout(settleTimer);
    requestedIndex = null;
    updateSelection();
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    // Preserve open-in-new-tab and other modified link actions.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPanel(index);
    panels[index].focus({ preventScroll: true });
    scheduleRotation();
  }));

  track.addEventListener('keydown', event => {
    // The site lets users edit copy. Do not intercept keys in those fields.
    if (event.target !== track) return;
    let index = requestedIndex ?? currentIndex();
    if (event.key === 'ArrowRight') index = Math.min(index + 1, panels.length - 1);
    else if (event.key === 'ArrowLeft') index = Math.max(index - 1, 0);
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = panels.length - 1;
    else return;
    event.preventDefault();
    showPanel(index);
    scheduleRotation();
  });

  let scheduled = false;
  track.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; updateSelection(); });
  }, { passive: true });
  track.addEventListener('scrollend', finishSelection);
  track.addEventListener('pointerdown', () => {
    pointerHeld = true;
    finishSelection();
    scheduleRotation();
  });
  const releasePointer = () => {
    if (!pointerHeld) return;
    pointerHeld = false;
    scheduleRotation();
  };
  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);
  track.addEventListener('wheel', () => {
    finishSelection();
    scheduleRotation();
  }, { passive: true });

  section.addEventListener('mouseenter', () => { hovered = true; scheduleRotation(); });
  section.addEventListener('mouseleave', () => { hovered = false; scheduleRotation(); });
  section.addEventListener('focusin', event => {
    // The explicit play control remains usable from the keyboard.
    focused = event.target !== rotationControl;
    scheduleRotation();
  });
  section.addEventListener('focusout', event => {
    focused = section.contains(event.relatedTarget) && event.relatedTarget !== rotationControl;
    scheduleRotation();
  });
  rotationControl.addEventListener('click', () => {
    userPaused = !userPaused;
    updateRotationControl();
    scheduleRotation();
  });
  document.addEventListener('visibilitychange', scheduleRotation);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) userPaused = true;
    updateRotationControl();
    scheduleRotation();
  });

  function updateVisibility(nextVisible) {
    if (visible === nextVisible) return;
    visible = nextVisible;
    scheduleRotation();
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const entry = entries[0];
      updateVisibility(entry.isIntersecting && entry.intersectionRatio >= .15);
    }, { threshold: .15 }).observe(section);
  } else {
    const checkVisibility = () => {
      const rect = section.getBoundingClientRect();
      updateVisibility(rect.bottom > 0 && rect.top < window.innerHeight);
    };
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
    checkVisibility();
  }
  new ResizeObserver(updateSelection).observe(track);
  window.addEventListener('hashchange', finishSelection);
  window.addEventListener('load', updateSelection, { once: true });
  updateRotationControl();
  updateSelection();
})();
