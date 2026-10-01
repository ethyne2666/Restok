import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Bell, Boxes, CalendarClock, Menu, Mic, ScanLine, Sparkles, TrendingDown } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SafeImage } from '@/components/SafeImage';
import { FloatingIcons } from '@/components/decor/FloatingIcons';
import { IMAGES } from '@/data/images';
import { Footer } from '@/components/Footer';
import { MobileMenu } from '@/components/MobileMenu';
import { appMenuSections } from '@/utils/menuItems';

const FEATURES = [
  { icon: Sparkles, title: 'Update by talking', text: 'Say or type "used 3 paracetamol" and the shelf updates itself.' },
  { icon: Bell, title: 'Low-stock alerts', text: 'See what is running out before the pharmacy counter does.' },
  { icon: CalendarClock, title: 'Expiry watch', text: 'Batches close to expiry are flagged early so nothing is wasted.' },
  { icon: ScanLine, title: 'Full history', text: 'Every receive and consume entry is logged with who and how.' },
];

const GALLERY = [
  { src: IMAGES.tablets, label: 'Every tablet counted' },
  { src: IMAGES.tabletStrip, label: 'Batch and expiry tracked' },
  { src: IMAGES.buyTablets, label: 'Built for the pharmacy counter' },
  { src: IMAGES.taking, label: 'So patients never run out' },
];

const MENU_SECTIONS = [
  {
    title: 'On this page',
    items: [
      { href: '#features', label: 'Features', icon: Sparkles },
      { href: '#preview', label: 'Dashboard preview', icon: Boxes },
    ],
  },
  ...appMenuSections,
];

// Static numbers only; this page never calls the backend.
const PREVIEW = [
  { label: 'Total items', value: 8, icon: Boxes },
  { label: 'Low stock', value: 2, icon: AlertTriangle },
  { label: 'Out of stock', value: 1, icon: TrendingDown },
  { label: 'Expiring soon', value: 1, icon: CalendarClock },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden="true" className="rs-grid rs-grid-fade absolute inset-0" />
      <FloatingIcons />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-4">
        <BrandLogo className="h-12 sm:h-14" to="/restok" />
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="hover:text-green-700">Features</a>
          <a href="#preview" className="hover:text-green-700">Preview</a>
          <Link to="/" className="hover:text-green-700">Open dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          {/* Dummy login: intentionally does nothing */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="rounded-xl p-2 text-slate-700 hover:bg-white md:hidden"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} sections={MENU_SECTIONS} />

      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 md:grid-cols-2 md:pt-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1 text-xs font-medium text-green-700">
            <Sparkles size={13} /> Medical stock management, with AI
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Know what is on the shelf before it runs out.
          </h1>
          <p className="mt-4 max-w-lg text-slate-600">
            Restok keeps track of medicines, quantities and expiry dates for clinics and pharmacies, and lets staff update stock with a
            sentence instead of a spreadsheet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
              Try the demo <ArrowRight size={16} />
            </Link>
            <a href="#features" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-green-300">
              See how it works
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl">
            <SafeImage src={IMAGES.heartTablets} alt="Tablets arranged in a heart" className="h-72 w-full md:h-96" />
          </div>
          <div className="absolute -bottom-6 -left-4 hidden w-40 overflow-hidden rounded-2xl border-4 border-white shadow-lg md:block">
            <SafeImage src={IMAGES.personTaking} alt="Person taking a tablet" className="h-28 w-full" />
          </div>
          <div className="absolute -right-3 -top-4 flex items-center gap-2 rounded-2xl border border-green-100 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg">
            <Mic size={14} className="text-green-600" /> "Used 3 Metformin"
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-2xl font-bold text-slate-900">What Restok does</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-green-100 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border-4 border-white shadow-xl">
          <SafeImage src={IMAGES.aiMedicine} alt="AI for medicine management" className="h-64 w-full md:h-80" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medicine management with AI</h2>
          <p className="mt-3 text-slate-600">
            Type, speak or scan. Restok reads the message, finds the medicine, shows you what will change, and only then updates the stock.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-8 md:grid-cols-4">
        {GALLERY.map((g) => (
          <figure key={g.label} className="group relative h-44 overflow-hidden rounded-2xl border-4 border-white shadow-md">
            <SafeImage src={g.src} alt={g.label} className="h-full w-full transition duration-500 group-hover:scale-110" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-xs font-medium text-white">
              {g.label}
            </figcaption>
          </figure>
        ))}
      </section>

      <section id="preview" className="relative z-10 mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-2xl font-bold text-slate-900">A look at the dashboard</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PREVIEW.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-green-100 bg-white/90 p-4 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer className="relative z-10" />
    </div>
  );
}