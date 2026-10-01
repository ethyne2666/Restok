import { Link } from 'react-router-dom';
import { Camera, Keyboard, Mic } from 'lucide-react';

const actions = [
  { mode: 'voice', label: 'Speak', icon: Mic },
  { mode: 'scan', label: 'Scan', icon: Camera },
  { mode: 'text', label: 'Type', icon: Keyboard },
];

export function AiUpdateCard() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-500 p-5 text-white shadow-lg sm:p-6">
      <h2 className="text-lg font-semibold">Update stock with AI</h2>
      <p className="mt-1 text-sm text-teal-50">Say it, snap it, or type it. We'll do the rest.</p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {actions.map(({ mode, label, icon: Icon }) => (
          <Link
            key={mode}
            to={`/ai?mode=${mode}`}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/15 py-4 text-sm font-medium backdrop-blur transition hover:bg-white/25 active:scale-95"
          >
            <Icon size={22} />
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}