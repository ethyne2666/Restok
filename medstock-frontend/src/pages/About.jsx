import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, HeartPulse, Sparkles, Target } from 'lucide-react';
import { SafeImage } from '@/components/SafeImage';
import { IMAGES } from '@/data/images';

// TODO: replace with your real names, roles and guide before showing sir.
const TEAM = [
  { name: 'Team member 1', role: 'Frontend' },
  { name: 'Team member 2', role: 'Backend' },
  { name: 'Team member 3', role: 'Design and testing' },
];

export default function About() {
  return (
    <div className="relative space-y-8">
      <div>
        <Link to="/" className="mb-2 inline-flex items-center gap-1 text-sm text-green-700 hover:underline"><ArrowLeft size={14} /> Dashboard</Link>
        <h1 className="text-2xl font-bold text-slate-900">About Restok</h1>
      </div>

      <section className="grid items-center gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl">
          <SafeImage src={IMAGES.heartTablets} alt="Care first" className="h-64 w-full" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Care starts with having the medicine</h2>
          <p className="mt-3 text-slate-600">
            Small clinics and pharmacies often find out a medicine has run out only when a patient asks for it. Restok keeps a live count of
            every medicine, warns before stock gets low or expires, and lets staff update it by voice, text or a photo.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Target, t: 'Our aim', d: 'Make medical stock easy enough that nothing runs out unnoticed.' },
          { icon: Sparkles, t: 'What is different', d: 'AI reads a plain sentence and prepares the stock update for confirmation.' },
          { icon: Bell, t: 'What it protects', d: 'Patients who depend on a regular dose, and stock that would expire unused.' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600"><Icon size={20} /></div>
            <h3 className="font-semibold text-slate-900">{t}</h3>
            <p className="mt-1 text-sm text-slate-500">{d}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900">The team</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {TEAM.map((p) => (
            <div key={p.name} className="rounded-2xl border border-green-100 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700"><HeartPulse size={26} /></div>
              <p className="font-semibold text-slate-900">{p.name}</p>
              <p className="text-xs text-slate-500">{p.role}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">Built with React, Tailwind and Spring Boot. College prototype running on sample data.</p>
      </section>
    </div>
  );
}
