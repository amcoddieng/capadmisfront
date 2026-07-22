const sounds = {
  notification: null,
  message: null,
};
let unlockListenerRegistered = false;

function getSound(name) {
  if (typeof window === 'undefined') return null;
  if (!sounds[name]) {
    sounds[name] = new Audio(`/sounds/${name}.mp3`);
    sounds[name].preload = 'auto';
  }
  return sounds[name];
}

export function registerAudioUnlock() {
  if (typeof window === 'undefined' || unlockListenerRegistered) return;
  unlockListenerRegistered = true;
  const unlock = () => {
    Object.values(sounds).forEach(sound => {
      if (!sound) return;
      sound.play().then(() => {
        sound.pause();
        sound.currentTime = 0;
      }).catch(() => {});
    });
  };
  window.addEventListener('pointerdown', unlock, { once: true, passive: true });
  window.addEventListener('keydown', unlock, { once: true, passive: true });
}

function playSound(name) {
  const sound = getSound(name);
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

export function playNotificationSound() {
  playSound('notification');
}

export function playMessageSound() {
  playSound('message');
}
