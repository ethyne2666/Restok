import { useState } from 'react';
import {
  Activity,
  MousePointer2,
  Route,
  Server,
  ShieldAlert,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageState } from '@/components/PageState';
import { useFetch } from '@/hooks/useFetch';

const POLL_MS = 10000;
const PAGE_SIZE = 25;

const SEVERITY_COLOR = {
  INFO: 'bg-sky-50 text-sky-700',
  WARNING: 'bg-amber-50 text-amber-700',
  ERROR: 'bg-rose-50 text-rose-700',
};

function MetricCard({ icon: Icon, label, value, tone = 'green' }) {
  const toneClasses = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
  };

  return (
    <article className="min-w-0 rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </article>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-green-100 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ActivityTable({
  events,
  page,
  totalPages,
  totalElements,
  onPageChange,
}) {
  const firstItem = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const lastItem = Math.min((page + 1) * PAGE_SIZE, totalElements);
  const displayTotalPages = Math.max(totalPages, 1);

  return (
    <div>
      {events.length === 0 ? (
        <p className="py-6 text-sm text-slate-500">
          No activity recorded for this demo session yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Activity</th>
                <th className="px-3 py-2">Path</th>
                <th className="px-3 py-2">Result</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        SEVERITY_COLOR[event.severity] || SEVERITY_COLOR.INFO
                      }`}
                    >
                      {event.type}
                    </span>
                  </td>
                  <td className="max-w-56 truncate px-3 py-3 text-slate-700">
                    {event.target || event.type}
                  </td>
                  <td className="max-w-48 truncate px-3 py-3 text-xs text-slate-500">
                    {event.path}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {event.status ?? event.severity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">
          Showing {firstItem}–{lastItem} of {totalElements} events
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 0}
            onClick={() => onPageChange((current) => Math.max(0, current - 1))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="min-w-20 text-center text-xs text-slate-500">
            Page {totalElements === 0 ? 0 : page + 1} of {displayTotalPages}
          </span>

          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() =>
              onPageChange((current) =>
                Math.min(Math.max(totalPages - 1, 0), current + 1)
              )
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActivitySecurity() {
  // Hooks belong inside the component, before any conditional return.
  const [logPage, setLogPage] = useState(0);

  const analytics = useFetch('/api/activity/analytics?days=14', {
    pollMs: POLL_MS,
  });

  const activityEvents = useFetch(
    `/api/activity/events?page=${logPage}&size=${PAGE_SIZE}`,
    { pollMs: POLL_MS }
  );

  const isLoading = analytics.isLoading || activityEvents.isLoading;
  const error = analytics.error || activityEvents.error;

  if (isLoading || error) {
    return <PageState isLoading={isLoading} error={error} />;
  }

  const data = analytics.data ?? {};
  const summary = data.summary ?? {};
  const daily = data.daily ?? [];
  const byEventType = data.byEventType ?? [];
  const topPages = data.topPages ?? [];
  const securitySignals = data.securitySignals ?? [];

  const eventPage = activityEvents.data ?? {};
  const events = eventPage.content ?? [];
  const totalElements = eventPage.totalElements ?? 0;
  const totalPages = eventPage.totalPages ?? 0;

  const eventTypeColors = [
    '#16a34a',
    '#0ea5e9',
    '#f59e0b',
    '#8b5cf6',
    '#ef4444',
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
          Demo session
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          User Activity &amp; Security
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Browser interactions and backend API activity for this browser
          session. Charts refresh every 10 seconds.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <MetricCard
          icon={Activity}
          label="Total events"
          value={summary.totalEvents ?? 0}
        />
        <MetricCard
          icon={Route}
          label="Page visits"
          value={summary.pageViews ?? 0}
          tone="blue"
        />
        <MetricCard
          icon={MousePointer2}
          label="Clicks"
          value={summary.clicks ?? 0}
          tone="amber"
        />
        <MetricCard
          icon={Server}
          label="API requests"
          value={summary.apiRequests ?? 0}
          tone="blue"
        />
        <MetricCard
          icon={ShieldAlert}
          label="Access-denied signals"
          value={summary.securitySignals ?? 0}
          tone="red"
        />
      </section>

      <Panel
        title="Activity over time"
        subtitle="Page visits, clicks, backend requests, and access-denied signals"
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="activityArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} width={36} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area
                dataKey="pageViews"
                name="Page visits"
                stackId="1"
                stroke="#16a34a"
                fill="url(#activityArea)"
              />
              <Area
                dataKey="clicks"
                name="Clicks"
                stackId="1"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.15}
              />
              <Area
                dataKey="apiRequests"
                name="API requests"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.12}
              />
              <Area
                dataKey="securitySignals"
                name="Access denied"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.16}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <Panel title="Activity types">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byEventType}
                  dataKey="count"
                  nameKey="label"
                  innerRadius="52%"
                  outerRadius="82%"
                >
                  {byEventType.map((entry, index) => (
                    <Cell
                      key={entry.label}
                      fill={eventTypeColors[index % eventTypeColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Most visited pages">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topPages}
                layout="vertical"
                margin={{ top: 4, right: 12, bottom: 4, left: 12 }}
              >
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 4"
                  horizontal={false}
                />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={110}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  name="Visits"
                  fill="#16a34a"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Security signals"
        subtitle="401/403 backend responses indicate denied access, not a confirmed attack."
      >
        {securitySignals.length === 0 || securitySignals[0]?.count === 0 ? (
          <p className="text-sm text-slate-500">
            No access-denied signals recorded in this session.
          </p>
        ) : (
          <ul className="space-y-2">
            {securitySignals.map((signal) => (
              <li
                key={signal.label}
                className="flex justify-between rounded-xl bg-amber-50 px-3 py-2 text-sm"
              >
                <span>{signal.label}</span>
                <b>{signal.count}</b>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel
        title="Recent activity log"
        subtitle="Latest 25 events per page, recorded by the backend"
      >
        <ActivityTable
          events={events}
          page={logPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setLogPage}
        />
      </Panel>
    </div>
  );
}