(() => {
  const player = document.getElementById('updater-player');
  const captionsButton = document.querySelector('[data-video-captions]');
  const captions = player?.querySelector('track[kind="captions"]')?.track;

  if (captions && captionsButton) {
    const syncCaptionsButton = () => {
      captionsButton.setAttribute('aria-pressed', String(captions.mode === 'showing'));
    };

    captionsButton.addEventListener('click', () => {
      captions.mode = captions.mode === 'showing' ? 'disabled' : 'showing';
      syncCaptionsButton();
    });
    player.textTracks.addEventListener('change', syncCaptionsButton);
    syncCaptionsButton();
    captionsButton.hidden = false;
  }

  if (!('IntersectionObserver' in window)) return;

  const visiblePart = .3;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.toggleAttribute('data-in-view', entry.intersectionRatio >= visiblePart);
    }
  }, { threshold: visiblePart });
  document.querySelectorAll('[data-motion], [data-scroll-motion]').forEach(shot => observer.observe(shot));
})();
