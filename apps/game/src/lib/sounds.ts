/**
 * Simple sound effects using Web Audio API
 */

let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
export function initAudioContext() {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
}

/**
 * Play a star reward sound
 */
export function playStarSound() {
  if (!audioContext) {
    initAudioContext();
  }

  if (!audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Star sound: quick ascending notes
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.2);

    // Quick fade out
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Error playing star sound:', error);
  }
}

/**
 * Play a medal achievement sound
 */
export function playMedalSound() {
  if (!audioContext) {
    initAudioContext();
  }

  if (!audioContext) return;

  try {
    // Create multiple oscillators for a chord
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G (C major chord)

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext!.createOscillator();
      const gainNode = audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext!.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioContext!.currentTime);

      // Stagger the notes slightly for a harp-like effect
      const startTime = audioContext!.currentTime + (index * 0.1);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 1.5);
    });

    // Add a bell-like sound
    const bellOsc = audioContext.createOscillator();
    const bellGain = audioContext.createGain();

    bellOsc.connect(bellGain);
    bellGain.connect(audioContext.destination);

    bellOsc.type = 'triangle';
    bellOsc.frequency.setValueAtTime(2093, audioContext.currentTime); // High C

    bellGain.gain.setValueAtTime(0.1, audioContext.currentTime);
    bellGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

    bellOsc.start(audioContext.currentTime);
    bellOsc.stop(audioContext.currentTime + 2);
  } catch (error) {
    console.error('Error playing medal sound:', error);
  }
}

/**
 * Play a success sound (for correct answers)
 */
export function playSuccessSound() {
  if (!audioContext) {
    initAudioContext();
  }

  if (!audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Success sound: two quick ascending notes
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Error playing success sound:', error);
  }
}

/**
 * Play an error sound (for incorrect answers)
 */
export function playErrorSound() {
  if (!audioContext) {
    initAudioContext();
  }

  if (!audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Error sound: low descending buzz
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Error playing error sound:', error);
  }
}
