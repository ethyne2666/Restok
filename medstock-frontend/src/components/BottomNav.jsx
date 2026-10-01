import { NavLink } from 'react-router-dom';
import { navItems } from '@/utils/navItems';
import { cn } from '@/utils/cn';

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-end justify-around px-2 pb-2 pt-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className="flex flex-col items-center gap-0.5 px-3 py-1">
              {({ isActive }) =>
                to === '/ai' ? (
                  <>
                    <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg ring-4 ring-white">
                      <Icon size={24} />
                    </span>
                    <span className="text-[10px] font-medium text-teal-700">{label}</span>
                  </>
                ) : (
                  <>
                    <Icon size={20} className={cn(isActive ? 'text-teal-600' : 'text-slate-400')} />
                    <span className={cn('text-[10px] font-medium', isActive ? 'text-teal-700' : 'text-slate-500')}>
                      {label}
                    </span>
                  </>
                )
              }
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}