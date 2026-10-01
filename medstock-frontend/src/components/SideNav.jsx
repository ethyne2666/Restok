import { NavLink, Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { navItems } from '@/utils/navItems';
import { BRAND } from '@/utils/brand';
import { cn } from '@/utils/cn';

export function SideNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-slate-200 bg-white p-4 md:flex">
      <div className="px-1 py-2">
        <BrandLogo className="h-14" />
      </div>
      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <Link to="/restok" className="mb-3 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50/60 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50">
        <Globe size={14} /> View landing page
      </Link>
      <p className="px-2 text-xs text-slate-400">{BRAND.tagline}</p>
    </aside>
  );
}