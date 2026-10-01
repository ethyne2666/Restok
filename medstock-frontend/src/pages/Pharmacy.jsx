import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CreditCard, Minus, Plus, ShoppingCart, Smartphone, Trash2 } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { PageState } from '@/components/PageState';
import { SafeImage } from '@/components/SafeImage';
import { IMAGES } from '@/data/images';

// Demo prices only (₹ per strip), derived from the name so they stay stable.
const priceOf = (name) => 18 + ((name.length * 7) % 40);

export default function Pharmacy() {
  const meds = useFetch('/api/medicines');
  const [cart, setCart] = useState({});
  const [method, setMethod] = useState('card');
  const [paid, setPaid] = useState(false);

  if (meds.isLoading || meds.error) return <PageState isLoading={meds.isLoading} error={meds.error} />;

  const items = meds.data.filter((m) => cart[m.id]);
  const count = items.reduce((a, m) => a + cart[m.id], 0);
  const subtotal = items.reduce((a, m) => a + cart[m.id] * priceOf(m.name), 0);
  const gst = Math.round(subtotal * 0.12);
  const change = (id, d) => {
    setPaid(false);
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + d) };
      if (!next[id]) delete next[id];
      return next;
    });
  };

  return (
    <div className="relative space-y-6">
      <div>
        <Link to="/" className="mb-2 inline-flex items-center gap-1 text-sm text-green-700 hover:underline"><ArrowLeft size={14} /> Dashboard</Link>
        <h1 className="text-2xl font-bold text-slate-900">Pharmacy counter</h1>
        <p className="text-sm text-slate-500">Restock your shelf. Payment is a demo and no money moves.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* CART: left side on desktop, below the medicine list on mobile */}
        <aside id="cart" className="order-2 scroll-mt-20 space-y-4 lg:order-1 lg:col-span-2 lg:sticky lg:top-6 lg:self-start">
          <section className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-green-100 bg-green-50/60 px-4 py-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
                <ShoppingCart size={20} />
                {count > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold">{count}</span>}
              </div>
              <h2 className="font-semibold text-slate-900">Your cart</h2>
            </div>
            {items.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">Cart is empty. Add medicines from the list.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-400">₹{priceOf(m.name)} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => change(m.id, -1)} className="rounded-lg border border-slate-200 p-1 hover:bg-slate-50" aria-label="Remove one"><Minus size={14} /></button>
                      <span className="w-6 text-center text-sm font-semibold">{cart[m.id]}</span>
                      <button type="button" onClick={() => change(m.id, 1)} className="rounded-lg border border-slate-200 p-1 hover:bg-slate-50" aria-label="Add one"><Plus size={14} /></button>
                      <button type="button" onClick={() => change(m.id, -cart[m.id])} className="ml-1 rounded-lg p-1 text-rose-500 hover:bg-rose-50" aria-label="Remove item"><Trash2 size={14} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <dl className="space-y-1 border-t border-green-100 px-4 py-3 text-sm">
              <div className="flex justify-between text-slate-500"><dt>Subtotal</dt><dd>₹{subtotal}</dd></div>
              <div className="flex justify-between text-slate-500"><dt>GST (12%)</dt><dd>₹{gst}</dd></div>
              <div className="flex justify-between text-base font-bold text-slate-900"><dt>Total</dt><dd>₹{subtotal + gst}</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-slate-900">Payment</h2>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {[['card', 'Card', CreditCard], ['upi', 'UPI', Smartphone]].map(([k, l, I]) => (
                <button key={k} type="button" onClick={() => setMethod(k)} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${method === k ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600'}`}>
                  <I size={16} /> {l}
                </button>
              ))}
            </div>
            {method === 'card' ? (
              <div className="space-y-2">
                <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Card number" inputMode="numeric" />
                <div className="grid grid-cols-2 gap-2">
                  <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="MM / YY" />
                  <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="CVV" />
                </div>
              </div>
            ) : (
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="name@upi" />
            )}
            <button type="button" disabled={!count} onClick={() => setPaid(true)} className="mt-3 w-full rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40">
              Pay ₹{subtotal + gst}
            </button>
            {paid && (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700"><CheckCircle2 size={16} /> Demo payment successful. Nothing was charged.</p>
            )}
          </section>
        </aside>

        {/* PRODUCTS: first on mobile, right side on desktop */}
        <section className="order-1 space-y-3 lg:order-2 lg:col-span-3">
          <div className="relative h-28 overflow-hidden rounded-2xl">
            <SafeImage src={IMAGES.buyTablets} alt="Pharmacy" className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-transparent" />
            <p className="absolute bottom-3 left-4 text-lg font-bold text-white">Restock from the counter</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {meds.data.map((m) => (
              <li key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-slate-900">{m.name} <span className="text-xs font-normal text-slate-400">{m.strength}</span></p>
                <p className="mt-0.5 text-xs text-slate-500">{m.quantity} in stock · min {m.minThreshold}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">₹{priceOf(m.name)}</span>
                  <button type="button" onClick={() => change(m.id, 1)} className="inline-flex items-center gap-1 rounded-xl bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"><Plus size={14} /> Add</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Mobile only: floating "view cart" bar above the bottom nav */}
      {count > 0 && (
        <a href="#cart" className="fixed inset-x-4 bottom-20 z-30 flex items-center justify-between rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-xl lg:hidden">
          <span className="flex items-center gap-2"><ShoppingCart size={18} /> {count} {count === 1 ? 'item' : 'items'}</span>
          <span>₹{subtotal + gst} · View cart</span>
        </a>
      )}
    </div>
  );
}