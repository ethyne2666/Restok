const EXAMPLES = [
  'I took 2 Paracetamol',
  'Received 30 Metformin',
  'How many Aspirin are left?',
  'What is running low?',
];

export function ExampleChips({ onPick }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {EXAMPLES.map((text) => (
        <button
          key={text}
          onClick={() => onPick(text)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
        >
          {text}
        </button>
      ))}
    </div>
  );
}