import { cn } from '@/utils/cn';

const styles = {
  OK: 'bg-green-100 text-green-700',
  LOW: 'bg-amber-100 text-amber-700',
  OUT_OF_STOCK: 'bg-red-100 text-red-700',
  LOW_STOCK: 'bg-amber-100 text-amber-700',
  EXPIRING_SOON: 'bg-orange-100 text-orange-700',
  CONSUMED: 'bg-rose-100 text-rose-700',
  RECEIVED: 'bg-green-100 text-green-700',
  INITIAL: 'bg-sky-100 text-sky-700',
};

export function Badge({ value }) {
  return (
    <span
      className={cn(
        'inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[value] ?? 'bg-slate-100 text-slate-700'
      )}
    >
      {value.replaceAll('_', ' ')}
    </span>
  );
}
