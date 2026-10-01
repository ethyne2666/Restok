import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Pill, Syringe, Heart, Cross } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/utils/brand";

const APP_LINKS = [
  { to: "/", label: "Home" },
  { to: "/medicines", label: "Stock" },
  { to: "/ai", label: "AI Update" },
  { to: "/transactions", label: "History" },
  { to: "/alerts", label: "Alerts" },
];

const EXPLORE_LINKS = [
  { to: "/analytics", label: "Tablet analytics" },
  { to: "/pharmacy", label: "Pharmacy counter" },
  { to: "/dose-tracker", label: "Daily dose tracker" },
  { to: "/about", label: "About us" },
  { to: "/restok", label: "Landing page" },
];

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-2 text-sm text-green-100/80">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="transition hover:text-white hover:underline">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ className = "" }) {
  return (
    <footer className={`relative w-full overflow-hidden bg-gradient-to-br from-green-800 via-green-900 to-emerald-950 text-white ${className}`}>
      {/* faint decorative icons */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-white/5">
        <Pill className="absolute -right-4 top-6 rotate-12" size={120} />
        <Syringe className="absolute bottom-4 right-1/3 -rotate-12" size={80} />
        <Heart className="absolute left-1/2 top-4" size={56} />
        <Cross className="absolute -bottom-6 left-6" size={110} />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-5 lg:gap-10">
        {/* big logo block */}
        <div className="lg:col-span-2">
          <div className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-lg sm:p-8">
            <BrandLogo className="h-28 sm:h-40 lg:h-44" />
            <p className="mt-3 text-sm font-medium text-green-800">{BRAND.tagline}</p>
            <p className="mt-1 max-w-xs text-xs text-slate-500">
              Track medicines, get alerts before stock runs out, and update the shelf with one sentence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-3">
          <LinkColumn title="App" links={APP_LINKS} />
          <LinkColumn title="Explore" links={EXPLORE_LINKS} />
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-3 text-sm font-semibold text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-green-100/80">
              <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 shrink-0" /> ece2412x@iiitkalyani.ac.in</li>
              <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 shrink-0" /> +91 6302968849</li>
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> IIIT Kalyani</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 text-center text-xs text-green-100/70 sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <span>© {new Date().getFullYear()} {BRAND.name}. College prototype. Made by CHARAN KUMAR , AYUSH KUMAR , ASHUTOSH KUMAR JHA , JAI DADHICH</span>
          <span>All data shown is sample data.</span>
        </div>
      </div>
    </footer>
  );
}