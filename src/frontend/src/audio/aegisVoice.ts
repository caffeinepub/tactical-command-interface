/**
 * aegisVoice — A.E.G.I.S. Voice System
 *
 * Lightweight wrapper around browser SpeechSynthesis.
 * No external APIs, no paid services, no blocking.
 *
 * Characteristics:
 *   rate  ~0.9  (slightly slower than default)
 *   pitch ~0.85 (slightly lower / more robotic)
 *
 * Queue behaviour:
 *   speak() cancels any in-progress speech before starting,
 *   then queues the new utterance. This prevents pile-ups.
 *
 * Mobile note: iOS Safari requires a user gesture before the
 * first SpeechSynthesis call can be heard. The speak() function
 * is safe to call before that gesture — it will just be silent.
 */

import { useSubtitleStore } from "../subtitle/useSubtitleStore";

const RATE = 0.9;
const PITCH = 0.85;
const VOLUME = 0.92;

/** Resolve a suitable voice. Prefers a low-pitched English voice. */
function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Prefer English voices; favour names that sound robotic/neutral
  const preferred = [
    "Google UK English Male",
    "Microsoft David",
    "Alex",
    "Fred",
    "Daniel",
  ];
  for (const name of preferred) {
    const v = voices.find((v) => v.name === name);
    if (v) return v;
  }
  // Fallback: first English voice
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

let _voiceReady = false;

function ensureVoices(cb: () => void) {
  if (_voiceReady) {
    cb();
    return;
  }
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length > 0) {
    _voiceReady = true;
    cb();
    return;
  }
  // Chrome/Edge load voices asynchronously
  window.speechSynthesis?.addEventListener(
    "voiceschanged",
    () => {
      _voiceReady = true;
      cb();
    },
    { once: true },
  );
}

/** Cancel current speech and speak new text. Non-blocking. */
export function speak(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  ensureVoices(() => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = RATE;
    utterance.pitch = PITCH;
    utterance.volume = VOLUME;
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    // Show subtitle while speaking
    useSubtitleStore.getState().show(text);
    utterance.onend = () => {
      useSubtitleStore.getState().clear();
    };
    utterance.onerror = () => {
      useSubtitleStore.getState().clear();
    };
    window.speechSynthesis.speak(utterance);
  });
}

/** Stop any active speech immediately. */
export function stopSpeech(): void {
  window.speechSynthesis?.cancel();
  useSubtitleStore.getState().clear();
}
