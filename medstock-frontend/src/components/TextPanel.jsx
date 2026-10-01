import { useState } from 'react';
import { Send } from 'lucide-react';
import { ExampleChips } from '@/components/ExampleChips';
import { inputClass } from '@/components/Field';

export function TextPanel({ onInput }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onInput(text, 'TEXT');
    setText('');
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. took 2 tablets of Paracetamol"
          className={inputClass}
        />
        <button
          type="submit"
          aria-label="Send"
          className="flex w-12 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-700"
        >
          <Send size={18} />
        </button>
      </form>
      <ExampleChips onPick={(example) => onInput(example, 'TEXT')} />
    </div>
  );
}