import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { PageState } from '@/components/PageState';
import { Badge } from '@/components/Badge';
import { Table } from '@/components/Table';
import { StockModal } from '@/components/StockModal';
import { MedicineForm } from '@/components/MedicineForm';
import { formatDate } from '@/utils/format';

export default function Medicines() {
  const { data, error, isLoading, reload } = useFetch('/api/medicines', { pollMs: 10000 });
  const [stockAction, setStockAction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleDone = () => {
    setStockAction(null);
    setShowForm(false);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medicines</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          + Add medicine
        </button>
      </div>

      <PageState isLoading={isLoading} error={error}>
        <Table headers={['Medicine', 'Batch', 'Stock', 'Days left', 'Expiry', 'Status', 'Actions']}>
          {data?.map((m) => (
            <tr key={m.id}>
              <td className="px-4 py-3 font-medium">{m.name} <span className="text-slate-400">{m.strength}</span></td>
              <td className="px-4 py-3 text-slate-500">{m.batchNo}</td>
              <td className="px-4 py-3">{m.quantity} <span className="text-slate-400">/ min {m.minThreshold}</span></td>
              <td className="px-4 py-3">{m.daysLeft}</td>
              <td className="px-4 py-3 text-slate-500">{formatDate(m.expiryDate)}</td>
              <td className="space-x-1 px-4 py-3">
                <Badge value={m.status} />
                {m.expiringSoon && <Badge value="EXPIRING_SOON" />}
              </td>
              <td className="space-x-2 whitespace-nowrap px-4 py-3">
                <button
                  onClick={() => setStockAction({ medicine: m, mode: 'consume' })}
                  disabled={m.quantity === 0}
                  className="rounded-md border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-100 disabled:opacity-40"
                >
                  Consume
                </button>
                <button
                  onClick={() => setStockAction({ medicine: m, mode: 'receive' })}
                  className="rounded-md bg-teal-50 px-2.5 py-1 text-xs text-teal-700 hover:bg-teal-100"
                >
                  Receive
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </PageState>

      {stockAction && (
        <StockModal
          medicine={stockAction.medicine}
          mode={stockAction.mode}
          onClose={() => setStockAction(null)}
          onDone={handleDone}
        />
      )}
      {showForm && <MedicineForm onClose={() => setShowForm(false)} onDone={handleDone} />}
    </div>
  );
}
