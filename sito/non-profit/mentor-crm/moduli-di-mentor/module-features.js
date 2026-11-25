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
  const autoAdvance = section.hasAttribute('data-auto-advance');
  let requestedIndex = null;
  let settleTimer;
  let rotationTimer;
  let visible = false;
  let focused = false;
  let keyboardNavigation = false;
  let pointerHeld = false;

  function scheduleRotation() {
    clearTimeout(rotationTimer);
    const canRotate = autoAdvance && !reducedMotion.matches && visible && !document.hidden && !focused && !pointerHeld;
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
    focused = true;
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

  // Pointer viewing keeps cycling; protect text editing and keyboard focus.
  const isEditing = target => !!target && (target.isContentEditable || target.matches?.('input, textarea, select'));
  window.addEventListener('keydown', () => {
    keyboardNavigation = true;
    if (section.contains(document.activeElement)) {
      focused = true;
      scheduleRotation();
    }
  });
  section.addEventListener('pointerdown', event => {
    keyboardNavigation = false;
    focused = isEditing(event.target);
    scheduleRotation();
  });
  section.addEventListener('focusin', event => {
    focused = keyboardNavigation || isEditing(event.target);
    scheduleRotation();
  });
  section.addEventListener('focusout', event => {
    focused = section.contains(event.relatedTarget) && (keyboardNavigation || isEditing(event.relatedTarget));
    scheduleRotation();
  });
  document.addEventListener('visibilitychange', scheduleRotation);
  reducedMotion.addEventListener('change', scheduleRotation);

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
  updateSelection();
})();
