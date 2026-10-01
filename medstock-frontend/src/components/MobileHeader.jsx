import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingCart } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileMenu } from "@/components/MobileMenu";
import { appMenuSections } from "@/utils/menuItems";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-green-100 bg-white/90 px-4 py-2 backdrop-blur md:hidden">
        <BrandLogo className="h-10" />
        <div className="flex items-center gap-1">
          <Link to="/pharmacy" aria-label="Open cart" className="rounded-xl p-2.5 text-slate-600 hover:bg-green-50 hover:text-green-700">
            <ShoppingCart size={22} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="rounded-xl p-2.5 text-slate-700 hover:bg-green-50 hover:text-green-700"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>
      {/* kept outside the header so the blur effect does not trap the fixed panel */}
      <MobileMenu open={open} onClose={() => setOpen(false)} sections={appMenuSections} />
    </>
  );
}