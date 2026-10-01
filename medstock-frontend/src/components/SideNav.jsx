import { NavLink } from 'react-router-dom';
import { BrandLogo } from '@/components/BrandLogo';
import { navItems } from '@/utils/navItems';
import { BRAND } from '@/utils/brand';
import { cn } from '@/utils/cn';

export function SideNav() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-slate-200 bg-white p-4 md:flex">
      <div className="px-2 py-3">
        <BrandLogo />
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
                isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <p className="px-2 text-xs text-slate-400">{BRAND.tagline}</p>
    </aside>
  );
}