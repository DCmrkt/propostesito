// Continuous silent playback while the hero is visible, preserving loop position.
(() => {
  const video = document.querySelector('.tmk-motion-video');
  if (!video) return;
  // WebKit can accept VP9 while displaying its transparent exterior as black.
  const useOpaqueFallback = /AppleWebKit/.test(navigator.userAgent) && !/(Chrome\/|Chromium\/|Edg\/)/.test(navigator.userAgent);
  if (useOpaqueFallback) {
    video.src = video.querySelector('source[type="video/mp4"]').src;
    video.load();
  }
  video.muted = true;
  video.autoplay = false;
  const nearViewport = () => {
    const rect = video.getBoundingClientRect();
    return rect.bottom > -200 && rect.top < window.innerHeight + 200;
  };
  let visible = nearViewport();
  function syncPlayback() {
    if (!visible || document.hidden) video.pause();
    else if (video.paused) video.play().catch(() => {});
  }
  function checkVisibility() {
    visible = nearViewport();
    syncPlayback();
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, { rootMargin: '200px 0px' }).observe(video);
  } else {
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);
  }
  video.addEventListener('loadeddata', checkVisibility);
  window.addEventListener('pageshow', checkVisibility);
  window.addEventListener('pagehide', () => video.pause());
  document.addEventListener('visibilitychange', checkVisibility);
  syncPlayback();
})();
