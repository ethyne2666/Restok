import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { PageState } from '@/components/PageState';
import { Badge } from '@/components/Badge';
import { Table } from '@/components/Table';
import { inputClass } from '@/components/Field';
import { formatDateTime } from '@/utils/format';

export default function Transactions() {
  const [medicineId, setMedicineId] = useState('');
  const medicines = useFetch('/api/medicines');
  const { data, error, isLoading } = useFetch(
    medicineId ? `/api/transactions?medicineId=${medicineId}` : '/api/transactions'
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Transaction history</h1>
        <select
          value={medicineId}
          onChange={(e) => setMedicineId(e.target.value)}
          className={`${inputClass} max-w-xs`}
        >
          <option value="">All medicines</option>
          {medicines.data?.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <PageState isLoading={isLoading} error={error}>
        <Table headers={['When', 'Medicine', 'Type', 'Qty', 'Stock', 'Source']}>
          {data?.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-3 text-slate-500">{formatDateTime(t.timestamp)}</td>
              <td className="px-4 py-3 font-medium">{t.medicineName}</td>
              <td className="px-4 py-3"><Badge value={t.type} /></td>
              <td className="px-4 py-3">{t.quantity}</td>
              <td className="px-4 py-3">{t.stockBefore} → {t.stockAfter}</td>
              <td className="px-4 py-3 text-slate-500">{t.source}</td>
            </tr>
          ))}
        </Table>
      </PageState>
    </div>
  );
}
