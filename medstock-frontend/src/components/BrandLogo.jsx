import { Sparkles } from 'lucide-react';
import { BRAND } from '@/utils/brand';

export function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm">
        <Sparkles size={18} />
      </div>
      <span className="text-lg font-bold tracking-tight text-slate-900">{BRAND.name}</span>
    </div>
  );
}