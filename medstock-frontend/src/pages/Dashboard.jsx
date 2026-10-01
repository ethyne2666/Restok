import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Boxes, CalendarClock, CircleCheck, PackagePlus, PackageX, Pill, Sparkles } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { PageState } from '@/components/PageState';
import { StatCard } from '@/components/StatCard';
import { StockBar } from '@/components/StockBar';
import { Badge } from '@/components/Badge';
import { AiUpdateCard } from '@/components/AiUpdateCard';
import { SourceIcon } from '@/components/SourceIcon';
import { formatDateTime } from '@/utils/format';
import { SafeImage } from '@/components/SafeImage';
import { IMAGES } from '@/data/images';

const POLL_MS = 10000;

const txIcons = {
  CONSUMED: { icon: ArrowDownRight, style: 'bg-rose-50 text-rose-500', sign: '−' },
  RECEIVED: { icon: ArrowUpRight, style: 'bg-emerald-50 text-emerald-600', sign: '+' },
  INITIAL: { icon: PackagePlus, style: 'bg-sky-50 text-sky-600', sign: '+' },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const summary = useFetch('/api/dashboard', { pollMs: POLL_MS });
  const medicines = useFetch('/api/medicines', { pollMs: POLL_MS });
  const transactions = useFetch('/api/transactions', { pollMs: POLL_MS });

  const isLoading = summary.isLoading || medicines.isLoading || transactions.isLoading;
  const error = summary.error || medicines.error || transactions.error;
  if (isLoading || error) return <PageState isLoading={isLoading} error={error} />;

  const s = summary.data;
  const attention = medicines.data.filter((m) => m.status !== 'OK' || m.expiringSoon);
  const recent = transactions.data.slice(0, 6);

  return (
    <div className="relative space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
        <div className="grid md:grid-cols-5">
          <div className="relative z-10 p-6 md:col-span-3 md:p-8">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{getGreeting()}</h1>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Here's how your stock looks today. Tell the AI what you used and Restok updates the shelf for you.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/ai" className="rs-pulse inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
                <Sparkles size={16} /> Update with AI
              </Link>
              <Link to="/medicines" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-green-300 hover:text-green-700">
                <Boxes size={16} /> Open stock
              </Link>
            </div>
          </div>
          <div className="relative h-40 md:col-span-2 md:h-auto">
            <SafeImage src={IMAGES.aiMedicine} alt="AI assisted medicine management" className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { src: IMAGES.tablets, label: 'Tablets', to: '/analytics' },
          { src: IMAGES.buyTablets, label: 'Pharmacy counter', to: '/pharmacy' },
          { src: IMAGES.heartTablets, label: 'Care first', to: '/about' },
          { src: IMAGES.personTaking, label: 'Daily dose', to: '/dose-tracker' },
        ].map((t) => (
          <Link key={t.label} to={t.to} className="group relative block h-24 overflow-hidden rounded-2xl border border-white shadow-sm md:h-28">
            <SafeImage src={t.src} alt={t.label} className="h-full w-full transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6 text-xs font-medium text-white">{t.label}</div>
          </Link>
        ))}
      </section>

      <AiUpdateCard />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total items" value={s.totalMedicines} icon={Boxes} tone="teal" />
        <StatCard label="Low stock" value={s.lowStock} icon={AlertTriangle} tone="amber" />
        <StatCard label="Out of stock" value={s.outOfStock} icon={PackageX} tone="red" />
        <StatCard label="Expiring soon" value={s.expiringSoon} icon={CalendarClock} tone="orange" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Needs attention</h2>
            <Link to="/medicines" className="text-sm text-green-700 hover:underline">View all</Link>
          </div>
          {attention.length === 0 ? (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CircleCheck size={20} /> Everything is well stocked.
            </div>
          ) : (
            <ul className="space-y-3">
              {attention.map((m) => (
                <li key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <Pill size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.strength}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1">
                      <Badge value={m.status} />
                      {m.expiringSoon && <Badge value="EXPIRING_SOON" />}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <StockBar quantity={m.quantity} minThreshold={m.minThreshold} status={m.status} />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{m.quantity} left · min {m.minThreshold}</span>
                      <span>~{m.daysLeft} days</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-slate-900">Recent activity</h2>
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {recent.map((t) => {
              const { icon: Icon, style, sign } = txIcons[t.type];
              return (
                <li key={t.id} className="flex items-center gap-3 p-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{t.medicineName}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-400">
                      <SourceIcon source={t.source} size={12} />
                      {formatDateTime(t.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{sign}{t.quantity}</p>
                    <p className="text-xs text-slate-400">{t.stockAfter} left</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}