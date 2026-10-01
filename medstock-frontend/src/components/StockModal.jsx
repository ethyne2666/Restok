import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Field, inputClass } from '@/components/Field';
import { api } from '@/utils/api';

const SOURCES = ['MANUAL', 'TEXT', 'VOICE', 'IMAGE'];

export function StockModal({ medicine, mode, onClose, onDone }) {
  const [quantity, setQuantity] = useState(1);
  const [source, setSource] = useState('MANUAL');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConsume = mode === 'consume';

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post(`/api/medicines/${medicine.id}/${mode}`, {
        quantity: Number(quantity),
        source: isConsume ? source : 'MANUAL',
      });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={`${isConsume ? 'Log consumption' : 'Receive stock'} · ${medicine.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">Current stock: {medicine.quantity}</p>
        <Field label="Quantity">
          <input
            type="number"
            min="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
          />
        </Field>
        {isConsume && (
          <Field label="Reported via">
            <select value={source} onChange={(e) => setSource(e.target.value)} className={inputClass}>
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
