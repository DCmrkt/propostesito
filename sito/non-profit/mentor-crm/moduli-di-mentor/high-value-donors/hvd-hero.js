// Autoplay continuously as requested, with no visible playback controls.
(() => {
  const video = document.querySelector('.hvd-motion-video');
  if (!video) return;
  video.muted = true;
  const play = () => video.play().catch(() => {});
  video.addEventListener('loadeddata', play);
  window.addEventListener('pageshow', play);
  play();
})();
