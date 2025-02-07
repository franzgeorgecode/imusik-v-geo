export const setupMediaSession = (audioElement, track, handlers) => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [
        {
          src: track.cover,
          sizes: '512x512',
          type: 'image/jpeg'
        }
      ]
    });

    navigator.mediaSession.setActionHandler('play', handlers.onPlay);
    navigator.mediaSession.setActionHandler('pause', handlers.onPause);
    navigator.mediaSession.setActionHandler('previoustrack', handlers.onPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', handlers.onNext);

    // Update position state
    audioElement.addEventListener('timeupdate', () => {
      if ('setPositionState' in navigator.mediaSession) {
        navigator.mediaSession.setPositionState({
          duration: audioElement.duration,
          playbackRate: audioElement.playbackRate,
          position: audioElement.currentTime
        });
      }
    });
  }
};

export const setupBackgroundPlayback = (audioElement) => {
  // Request wake lock to prevent device sleep
  if ('wakeLock' in navigator) {
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.log('Wake Lock error:', err);
      }
    };

    document.addEventListener('visibilitychange', async () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
      }
    });

    requestWakeLock();
  }

  // Handle audio focus
  if ('audioSession' in navigator) {
    navigator.audioSession.addEventListener('interruptionbegin', () => {
      if (audioElement.playing) {
        audioElement.pause();
      }
    });

    navigator.audioSession.addEventListener('interruptionend', () => {
      if (!audioElement.playing) {
        audioElement.play().catch(console.error);
      }
    });
  }
};
