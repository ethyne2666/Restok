import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Field, inputClass } from '@/components/Field';
import { api } from '@/utils/api';

const initialForm = {
  name: '',
  strength: '',
  quantity: 30,
  minThreshold: 5,
  dailyDose: 1,
  batchNo: '',
  expiryDate: '',
};

export function MedicineForm({ onClose, onDone }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/api/medicines', {
        ...form,
        quantity: Number(form.quantity),
        minThreshold: Number(form.minThreshold),
        dailyDose: Number(form.dailyDose),
      });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title="Add medicine" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field label="Name">
          <input required value={form.name} onChange={update('name')} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Strength">
            <input value={form.strength} onChange={update('strength')} placeholder="500 mg" className={inputClass} />
          </Field>
          <Field label="Batch no.">
            <input value={form.batchNo} onChange={update('batchNo')} className={inputClass} />
          </Field>
          <Field label="Opening stock">
            <input type="number" min="0" required value={form.quantity} onChange={update('quantity')} className={inputClass} />
          </Field>
          <Field label="Minimum threshold">
            <input type="number" min="0" required value={form.minThreshold} onChange={update('minThreshold')} className={inputClass} />
          </Field>
          <Field label="Daily dose">
            <input type="number" min="1" required value={form.dailyDose} onChange={update('dailyDose')} className={inputClass} />
          </Field>
          <Field label="Expiry date">
            <input type="date" required value={form.expiryDate} onChange={update('expiryDate')} className={inputClass} />
          </Field>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
