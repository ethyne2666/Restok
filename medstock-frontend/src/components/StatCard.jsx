import { cn } from '@/utils/cn';

const tones = {
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  orange: 'bg-orange-50 text-orange-600',
};

export function StatCard({ label, value, icon: Icon, tone = 'teal' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={cn('mb-3 flex h-9 w-9 items-center justify-center rounded-xl', tones[tone])}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}