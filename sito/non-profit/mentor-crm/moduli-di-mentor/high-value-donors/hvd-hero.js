// Autoplay continuously as requested, with no visible playback controls.
(() => {
  const video = document.querySelector('.hvd-motion-video');
  if (!video) return;
  // Review links show each direction inside the real landing header.
  const requested = new URLSearchParams(window.location.search).get('hero');
  const variants = {a:'A · Semplificata',b:'B · Fedele e leggibile',c:'C · Completa'};
  const reviewing = Object.hasOwn(variants, requested);
  // Older WebKit accepts VP9 but renders its alpha channel opaque.
  const useOpaqueFallback = /AppleWebKit/.test(navigator.userAgent) && !/(Chrome\/|Chromium\/|Edg\/)/.test(navigator.userAgent);
  if (reviewing || useOpaqueFallback) {
    const folder = `varianti-hero/${reviewing ? requested : 'a'}/`;
    video.poster = `${folder}poster-transparent.png?v=20261117-motion2`;
    video.querySelector('source[type="video/webm"]').src = `${folder}mentor-hero-alpha.webm?v=20261117-motion2`;
    video.querySelector('source[type="video/mp4"]').src = `${folder}mentor-hero.mp4?v=20261117-motion2`;
    if (useOpaqueFallback) video.src = `${folder}mentor-hero.mp4?v=20261117-motion2`;
    video.load();
  }
  if (reviewing) {
    const nav = document.createElement('nav');
    nav.className = 'hvd-hero-review';
    nav.setAttribute('aria-label', 'Confronta le versioni nell’header');
    for (const [key,label] of Object.entries(variants)) {
      const link = document.createElement('a');
      const url = new URL(window.location.href);
      url.searchParams.set('hero',key);
      url.hash = '';
      link.href = url.href;
      link.textContent = label;
      if (key === requested) link.setAttribute('aria-current','page');
      nav.append(link);
    }
    document.body.append(nav);
  }
  video.muted = true;
  const play = () => video.play().catch(() => {});
  video.addEventListener('loadeddata', play);
  window.addEventListener('pageshow', play);
  play();
})();
