import { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { PageState } from '@/components/PageState';
import { Badge } from '@/components/Badge';
import { api } from '@/utils/api';
import { cn } from '@/utils/cn';
import { formatDateTime } from '@/utils/format';

export default function Alerts() {
  const [openOnly, setOpenOnly] = useState(true);
  const { data, error, isLoading, reload } = useFetch(`/api/alerts?openOnly=${openOnly}`, {
    pollMs: 10000,
  });

  async function handleResolve(id) {
    await api.patch(`/api/alerts/${id}/resolve`);
    reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alerts</h1>
        <div className="flex gap-1 rounded-lg bg-slate-200 p-1 text-sm">
          {[
            { label: 'Open', value: true },
            { label: 'All', value: false },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setOpenOnly(value)}
              className={cn('rounded-md px-3 py-1', openOnly === value && 'bg-white shadow-sm')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <PageState isLoading={isLoading} error={error}>
        {data?.length === 0 && <p className="text-sm text-slate-500">No alerts.</p>}
        <ul className="space-y-3">
          {data?.map((a) => (
            <li
              key={a.id}
              className={cn(
                'flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
                a.resolved && 'opacity-60'
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge value={a.type} />
                  <span className="text-xs text-slate-400">{formatDateTime(a.createdAt)}</span>
                </div>
                <p className="text-sm">{a.message}</p>
              </div>
              {a.resolved ? (
                <span className="text-xs text-green-600">Resolved</span>
              ) : (
                <button
                  onClick={() => handleResolve(a.id)}
                  className="rounded-md border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
                >
                  Resolve
                </button>
              )}
            </li>
          ))}
        </ul>
      </PageState>
    </div>
  );
}
