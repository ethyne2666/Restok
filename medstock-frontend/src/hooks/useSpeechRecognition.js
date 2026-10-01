import { useCallback, useEffect, useRef, useState } from 'react';

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export function useSpeechRecognition({ lang = 'en-IN', onFinal }) {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const onFinalRef = useRef(onFinal);

  useEffect(() => {
    onFinalRef.current = onFinal;
  });

  const start = useCallback(() => {
    if (!SpeechRecognition) return;
    recognitionRef.current?.abort();

    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    const isCurrent = () => recognitionRef.current === rec;

    rec.onstart = () => {
      if (!isCurrent()) return;
      setIsListening(true);
      setError('');
      setInterim('');
    };
    rec.onresult = (e) => {
      if (!isCurrent()) return;
      let text = '';
      let isFinal = false;
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        text += e.results[i][0].transcript;
        if (e.results[i].isFinal) isFinal = true;
      }
      if (isFinal) {
        setInterim('');
        onFinalRef.current?.(text.trim());
      } else {
        setInterim(text);
      }
    };
    rec.onerror = (e) => {
      if (!isCurrent() || e.error === 'no-speech' || e.error === 'aborted') return;
      setError(e.error === 'not-allowed' ? 'Microphone permission denied' : `Voice error: ${e.error}`);
    };
    rec.onend = () => {
      if (!isCurrent()) return;
      setIsListening(false);
      setInterim('');
    };

    recognitionRef.current = rec;
    rec.start();
  }, [lang]);

  const stop = useCallback(() => recognitionRef.current?.stop(), []);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { isSupported: Boolean(SpeechRecognition), isListening, interim, error, start, stop };
}