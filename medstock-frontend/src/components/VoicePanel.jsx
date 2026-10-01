import { useState } from 'react';
import { Mic, Square, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { speak, stopSpeaking } from '@/utils/speak';
import { ExampleChips } from '@/components/ExampleChips';
import { cn } from '@/utils/cn';

const LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'bn-IN', label: 'Bengali' },
];

export function VoicePanel({ onInput }) {
  const [lang, setLang] = useState('en-IN');
  const [speakReplies, setSpeakReplies] = useState(true);
  const [heard, setHeard] = useState('');

  const { isSupported, isListening, interim, error, start, stop } = useSpeechRecognition({
    lang,
    onFinal: (text) => handleFinal(text),
  });

  async function handleFinal(text) {
    setHeard(text);
    const { reply, expectReply } = await onInput(text, 'VOICE');
    if (speakReplies) {
      speak(reply, { lang, onEnd: expectReply ? start : undefined });
    }
  }

  async function handleExample(text) {
    setHeard(text);
    const { reply } = await onInput(text, 'TEXT');
    if (speakReplies) speak(reply, { lang });
  }

  function handleMicClick() {
    if (isListening) {
      stop();
      return;
    }
    stopSpeaking();
    start();
  }

  function toggleSpeakReplies() {
    if (speakReplies) stopSpeaking();
    setSpeakReplies((prev) => !prev);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
        <button
          onClick={toggleSpeakReplies}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
        >
          {speakReplies ? <Volume2 size={16} /> : <VolumeX size={16} />}
          Voice replies {speakReplies ? 'on' : 'off'}
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 py-2">
        <div className="relative">
          {isListening && <span className="absolute inset-0 animate-ping rounded-full bg-teal-400/50" />}
          <button
            onClick={handleMicClick}
            disabled={!isSupported}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            className={cn(
              'relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 disabled:opacity-40',
              isListening ? 'bg-red-500' : 'bg-gradient-to-br from-teal-500 to-emerald-500'
            )}
          >
            {isListening ? <Square size={30} /> : <Mic size={34} />}
          </button>
        </div>
        <p className="min-h-6 max-w-xs text-center text-sm text-slate-600">
          {interim || (isListening ? 'Listening…' : heard ? `"${heard}"` : 'Tap the mic and speak')}
        </p>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {!isSupported && (
          <p className="max-w-xs text-center text-xs text-amber-600">
            Voice input needs Chrome, Edge or Safari. You can still try the examples below.
          </p>
        )}
        {lang !== 'en-IN' && lang !== 'en-US' && (
          <p className="max-w-xs text-center text-xs text-slate-400">
            Understanding {LANGUAGES.find((l) => l.code === lang).label} commands comes with the AI backend (Phase 3).
          </p>
        )}
      </div>

      <ExampleChips onPick={handleExample} />
    </div>
  );
}