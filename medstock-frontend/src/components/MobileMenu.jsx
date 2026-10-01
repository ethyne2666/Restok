import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/utils/brand";
import { cn } from "@/utils/cn";

// Slide-in menu for phones. items can use `to` (page) or `href` (anchor on the same page).
export function MobileMenu({ open, onClose, sections }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <div className="md:hidden">
      {/* dark overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* panel */}
      <aside
        id="mobile-menu"
        aria-label="Menu"
        inert={!open}
        onClick={(e) => e.target.closest("a") && onClose()}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-green-100 bg-green-50/60 px-4 py-3">
          <BrandLogo className="h-11" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-xl p-2 text-slate-600 hover:bg-white hover:text-green-700"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-1.5 px-3 text-xs font-semibold text-slate-400">{section.title}</p>
              <ul className="space-y-1">
                {section.items.map(({ to, href, label, icon: Icon, end }) => (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-green-50"
                      >
                        <Icon size={19} className="text-green-600" /> {label}
                      </a>
                    ) : (
                      <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                            isActive ? "bg-green-50 text-green-700" : "text-slate-700 hover:bg-green-50"
                          )
                        }
                      >
                        <Icon size={19} className="text-green-600" /> {label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="border-t border-green-100 px-5 py-4 text-xs text-slate-400">{BRAND.tagline}</p>
      </aside>
    </div>
  );
}