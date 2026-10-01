import { cn } from '@/utils/cn';

const colors = { OK: 'bg-emerald-500', LOW: 'bg-amber-500', OUT_OF_STOCK: 'bg-red-500' };

export function StockBar({ quantity, minThreshold, status }) {
  const pct = Math.min(100, Math.round((quantity / Math.max(minThreshold * 3, 1)) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={cn('h-full rounded-full transition-all', colors[status])} style={{ width: `${pct}%` }} />
    </div>
  );
}