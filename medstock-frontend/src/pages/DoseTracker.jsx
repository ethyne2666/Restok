import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CalendarClock } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { PageState } from '@/components/PageState';
import { SafeImage } from '@/components/SafeImage';
import { IMAGES } from '@/data/images';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// Demo history: a stable pattern per medicine so the week looks real.
const wasTaken = (id, d) => (id * 3 + d * 5) % 7 !== 0;

export default function DoseTracker() {
  const meds = useFetch('/api/medicines');
  const [taken, setTaken] = useState({}); // "medId-doseIndex" -> true
  if (meds.isLoading || meds.error) return <PageState isLoading={meds.isLoading} error={meds.error} />;

  const todayIdx = (new Date().getDay() + 6) % 7;
  const all = meds.data.reduce((a, m) => a + m.dailyDose, 0);
  const done = Object.values(taken).filter(Boolean).length;
  const pct = all ? Math.round((done / all) * 100) : 0;

  return (
    <div className="relative space-y-6">
      <div>
        <Link to="/" className="mb-2 inline-flex items-center gap-1 text-sm text-green-700 hover:underline"><ArrowLeft size={14} /> Dashboard</Link>
        <h1 className="text-2xl font-bold text-slate-900">Daily dose tracker</h1>
        <p className="text-sm text-slate-500">Tick each dose as it is taken. Ticks reset when you reload.</p>
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
        <SafeImage src={IMAGES.taking} alt="Taking a tablet" className="absolute inset-y-0 right-0 hidden h-full w-1/3 md:block" />
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-r from-white to-transparent md:block" />
        <div className="relative p-6 md:w-2/3">
          <p className="text-sm text-slate-500">Today's progress</p>
          <p className="text-3xl font-bold text-slate-900">{done} of {all} doses</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
      </section>

      <ul className="grid gap-4 md:grid-cols-2">
        {meds.data.map((m) => (
          <li key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-slate-900">{m.name}</p>
                <p className="text-xs text-slate-400">{m.strength} · {m.dailyDose} per day</p>
              </div>
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.daysLeft <= 3 ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-700'}`}>
                <CalendarClock size={12} /> {m.daysLeft} days left
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: m.dailyDose }, (_, i) => {
                const key = `${m.id}-${i}`;
                return (
                  <button key={key} type="button" onClick={() => setTaken((t) => ({ ...t, [key]: !t[key] }))}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${taken[key] ? 'border-green-500 bg-green-500 text-white' : 'border-slate-200 text-slate-600 hover:border-green-300'}`}>
                    {taken[key] && <Check size={13} />} Dose {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              {DAYS.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400">{d}</span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${i > todayIdx ? 'bg-slate-50 text-slate-300' : wasTaken(m.id, i) ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-600'}`}>
                    {i > todayIdx ? '' : wasTaken(m.id, i) ? <Check size={12} /> : '×'}
                  </span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
