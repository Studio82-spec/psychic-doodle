(() => {
  const dialog = document.querySelector('.motion-dialog');
  if (!dialog) return;
  const video = dialog.querySelector('video');
  const status = dialog.querySelector('.motion-player-status');
  const pip = dialog.querySelector('.motion-pip');
  let trigger;
  let previousOverflow = '';
  let playbackRequest = 0;
  const loadError = 'The video could not load. Please close the player and try again.';
  document.querySelectorAll('[data-video]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      const request = ++playbackRequest;
      status.textContent = '';
      dialog.querySelector('h2').textContent = button.dataset.title;
      video.src = button.dataset.video;
      video.poster = button.dataset.poster || '';
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      video.play().catch(error => {
        if (request !== playbackRequest || !dialog.open || error.name === 'AbortError') return;
        status.textContent = error.name === 'NotAllowedError' && !video.error
          ? 'Press play to start the film.'
          : loadError;
      });
    });
  });
  dialog.querySelector('.motion-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    playbackRequest++;
    video.pause();
    if (document.pictureInPictureElement === video) document.exitPictureInPicture().catch(() => {});
    video.removeAttribute('src');
    video.load();
    document.body.style.overflow = previousOverflow;
    trigger?.focus();
  });
  video.addEventListener('error', () => { if (video.getAttribute('src')) status.textContent = loadError; });
  video.addEventListener('playing', () => { status.textContent = ''; });
  if (document.pictureInPictureEnabled && video.requestPictureInPicture) {
    pip.hidden = false;
    pip.addEventListener('click', async () => {
      try {
        if (document.pictureInPictureElement === video) await document.exitPictureInPicture();
        else await video.requestPictureInPicture();
      } catch { status.textContent = 'Picture-in-picture is unavailable here. You can keep watching in this player.'; }
    });
    video.addEventListener('enterpictureinpicture', () => { pip.textContent = 'Return to player ↙'; });
    video.addEventListener('leavepictureinpicture', () => { pip.textContent = 'Picture-in-picture ↗'; });
  }
})();
