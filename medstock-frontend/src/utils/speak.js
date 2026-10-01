const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text, { lang = 'en-IN', onEnd } = {}) {
  if (!isSupported) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => {
    if (e.error !== 'interrupted' && e.error !== 'canceled') onEnd?.();
  };
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSupported) window.speechSynthesis.cancel();
}