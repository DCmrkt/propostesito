(() => {
  const navigation = document.querySelector('.reader-solution-nav');
  const tabs = [...navigation.querySelectorAll('a')];
  const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
  let tabHadFocus = false;

  function showPanel(selectedIndex) {
    tabs.forEach((tab, index) => {
      const selected = index === selectedIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[index].hidden = !selected;
    });
  }

  function syncHash() {
    const matchingIndex = tabs.findIndex(tab => tab.hash === location.hash);
    const index = Math.max(0, matchingIndex);
    showPanel(index);
    if (tabHadFocus && (matchingIndex >= 0 || !location.hash)) {
      tabs[index].focus({ preventScroll: true });
    }
  }

  function selectTab(index) {
    const { hash } = tabs[index];
    if (location.hash !== hash) history.pushState(null, '', hash);
    showPanel(index);
  }

  navigation.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;

    tab.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      selectTab(index);
    });

    tab.addEventListener('keydown', event => {
      let nextIndex;
      switch (event.key) {
        case 'ArrowLeft': nextIndex = (index + tabs.length - 1) % tabs.length; break;
        case 'ArrowRight': nextIndex = (index + 1) % tabs.length; break;
        case 'Home': nextIndex = 0; break;
        case 'End': nextIndex = tabs.length - 1; break;
        case ' ': nextIndex = index; break;
        default: return;
      }
      event.preventDefault();
      selectTab(nextIndex);
      tabs[nextIndex].focus();
    });
  });
  // Browsers can clear focus before dispatching hashchange during history traversal.
  document.addEventListener('focusin', event => {
    if (event.target !== document.body) tabHadFocus = tabs.includes(event.target);
  });
  document.addEventListener('pointerdown', event => {
    if (!navigation.contains(event.target)) tabHadFocus = false;
  });
  window.addEventListener('hashchange', syncHash);
  syncHash();
})();

(() => {
  const video = document.getElementById('reader-preview');
  const toggle = document.querySelector('.reader-motion-toggle');
  const icon = toggle.querySelector('span');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let playRequested = !reducedMotion.matches;
  let nearViewport = false;

  function syncPlayback() {
    if (playRequested && nearViewport && !document.hidden) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function updateToggle() {
    toggle.setAttribute('aria-label', video.paused ? 'Riproduci l’anteprima' : 'Metti in pausa l’anteprima');
    icon.textContent = video.paused ? '▶' : 'Ⅱ';
  }

  video.addEventListener('play', updateToggle);
  video.addEventListener('pause', updateToggle);
  toggle.addEventListener('click', () => {
    playRequested = video.paused;
    syncPlayback();
  });
  reducedMotion.addEventListener('change', () => {
    playRequested = !reducedMotion.matches;
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  new IntersectionObserver(([entry]) => {
    nearViewport = entry.isIntersecting;
    syncPlayback();
  }, { rootMargin: '100px 0px' }).observe(video);
  updateToggle();
  toggle.hidden = false;
})();
