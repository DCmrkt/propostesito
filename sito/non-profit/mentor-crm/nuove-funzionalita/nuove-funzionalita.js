(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  for (const demo of document.querySelectorAll('[data-motion]')) {
    const button = demo.querySelector('.updates-motion-button');
    let inView = !('IntersectionObserver' in window);
    let paused = false;

    function updatePlayback() {
      const motionAllowed = !motionPreference.matches;
      demo.toggleAttribute('data-animated', motionAllowed && (inView || demo.hasAttribute('data-animated')));
      demo.toggleAttribute('data-running', motionAllowed && inView && !paused && !document.hidden);
      button.hidden = !motionAllowed;
      button.firstChild.nodeValue = paused ? 'Riprendi' : 'Pausa';
    }

    button.addEventListener('click', () => {
      paused = !paused;
      updatePlayback();
    });
    motionPreference.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        updatePlayback();
      });
      observer.observe(demo);
    }

    updatePlayback();
  }
})();
