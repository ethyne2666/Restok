import { Check, Minus, Plus, TriangleAlert, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { inputClass } from '@/components/Field';

const INTENTS = [
  { value: 'consume', label: 'Used' },
  { value: 'receive', label: 'Received' },
];

export function ConfirmUpdate({ proposal, medicines, isBusy, onChange, onConfirm, onCancel }) {
  const { medicine, quantity, intent, heard, isDemo } = proposal;
  const setQuantity = (q) => onChange({ ...proposal, quantity: Math.max(1, q) });

  return (
    <div className="space-y-4 rounded-2xl border border-teal-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Review before saving</span>
        <span className="max-w-40 truncate">{heard}</span>
      </div>

      {isDemo && (
        <p className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <TriangleAlert size={14} /> Demo result: the AI scan endpoint is not connected yet.
        </p>
      )}

      <select
        value={medicine.id}
        onChange={(e) => onChange({ ...proposal, medicine: medicines.find((m) => m.id === Number(e.target.value)) })}
        className={inputClass}
      >
        {medicines.map((m) => (
          <option key={m.id} value={m.id}>{m.name} {m.strength}</option>
        ))}
      </select>

      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-lg bg-slate-100 p-1 text-sm">
          {INTENTS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ ...proposal, intent: value })}
              className={cn('rounded-md px-3 py-1', intent === value && 'bg-white font-medium shadow-sm')}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setQuantity(quantity - 1)} aria-label="Decrease" className="rounded-full border border-slate-200 p-2 hover:bg-slate-50">
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-xl font-bold">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase" className="rounded-full border border-slate-200 p-2 hover:bg-slate-50">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Stock: {medicine.quantity} → {intent === 'consume' ? medicine.quantity - quantity : medicine.quantity + quantity}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={onCancel} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
          <X size={16} /> Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isBusy}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          <Check size={16} /> {isBusy ? 'Saving…' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}