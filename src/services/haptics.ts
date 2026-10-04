// Haptics and Audio feedback for authentic Android / Samsung One UI feel

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playWaterDropSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency sweeps up rapidly like a crisp water droplet
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Ignore audio errors
  }
}

export function playSoftClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Ignore
  }
}

export function playCelebrationChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
    });
  } catch {
    // Ignore
  }
}

export function triggerVibration(pattern: number | number[] = 25) {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration error
    }
  }
}

export function hapticFeedback(type: 'wear' | 'not_wear' | 'tap' | 'celebrate', soundEnabled = true, vibrationEnabled = true) {
  if (vibrationEnabled) {
    if (type === 'wear') {
      triggerVibration([20, 30, 35]); // Samsung quick double tactile tap
    } else if (type === 'not_wear') {
      triggerVibration(25);
    } else if (type === 'tap') {
      triggerVibration(15);
    } else if (type === 'celebrate') {
      triggerVibration([50, 40, 80, 50, 100]);
    }
  }

  if (soundEnabled) {
    if (type === 'wear') {
      playWaterDropSound();
    } else if (type === 'not_wear' || type === 'tap') {
      playSoftClickSound();
    } else if (type === 'celebrate') {
      playCelebrationChime();
    }
  }
}
