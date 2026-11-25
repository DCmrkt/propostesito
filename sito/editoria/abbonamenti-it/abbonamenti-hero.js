(() => {
  const video = document.querySelector('[data-abb-motion]');
  if (!video) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const agent = navigator.userAgent;
  // WebKit may decode VP9 without preserving transparency.
  const needsOpaqueVideo = /AppleWebKit/.test(agent) && !/(Chrome\/|Chromium\/|Edg\/)/.test(agent);
  const margin = 120;

  function isNearViewport() {
    const { top, bottom } = video.getBoundingClientRect();
    return bottom > -margin && top < window.innerHeight + margin;
  }

  function syncPlayback() {
    if (reducedMotion.matches || document.hidden || !isNearViewport()) {
      video.pause();
      return;
    }
    if (needsOpaqueVideo && !video.hasAttribute('src')) {
      video.src = video.querySelector('source[type="video/mp4"]').src;
    }
    if (video.paused) video.play().catch(() => {});
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(syncPlayback, { rootMargin: `${margin}px 0px` }).observe(video);
  } else {
    window.addEventListener('scroll', syncPlayback, { passive: true });
    window.addEventListener('resize', syncPlayback);
  }
  reducedMotion.addEventListener('change', syncPlayback);
  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('pageshow', syncPlayback);
  window.addEventListener('pagehide', () => video.pause());
  syncPlayback();
})();
