import { Link } from 'react-router-dom';
import { ArrowLeft, Boxes, Gauge, Layers, TrendingDown } from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useFetch } from '@/hooks/useFetch';
import { PageState } from '@/components/PageState';
import { DownloadAuditLogButton } from '@/components/DownloadAuditLogButton';

const POLL_MS = 10000;
const DAYS_TO_SHOW = 14;

const STATUS_COLOR = {
    OK: '#22c55e',
    LOW: '#f59e0b',
    OUT_OF_STOCK: '#ef4444',
};

const STATUS_LABEL = {
    OK: 'In stock',
    LOW: 'Low',
    OUT_OF_STOCK: 'Out of stock',
};

function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function makeDailyConsumption(transactions) {
    const days = new Map();

    // Fill in dates with zero use too, so the chart always shows the full period.
    for (let offset = DAYS_TO_SHOW - 1; offset >= 0; offset -= 1) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - offset);

        const key = getDateKey(date);
        days.set(key, {
            key,
            label: date.toLocaleDateString(undefined, {
                month: '2-digit',
                day: '2-digit',
            }),
            units: 0,
        });
    }

    for (const transaction of transactions) {
        if (transaction.type !== 'CONSUMED' || !transaction.timestamp) continue;

        const timestamp = new Date(transaction.timestamp);
        if (Number.isNaN(timestamp.getTime())) continue;

        const day = days.get(getDateKey(timestamp));
        if (day) day.units += Number(transaction.quantity) || 0;
    }

    return [...days.values()];
}

function Kpi({ icon: Icon, label, value }) {
    return (
        <article className="min-w-0 rounded-2xl border border-green-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:mb-3">
                <Icon size={18} />
            </div>
            <p className="truncate text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
            <p className="text-xs leading-5 text-slate-500">{label}</p>
        </article>
    );
}

function ChartCard({ title, subtitle, children, className = '' }) {
    return (
        <section className={`min-w-0 rounded-2xl border border-green-100 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
            <div className="mb-3">
                <h2 className="font-semibold text-slate-900">{title}</h2>
                {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
            </div>
            {children}
        </section>
    );
}

export default function Analytics() {
    const meds = useFetch('/api/medicines', { pollMs: POLL_MS });
    const tx = useFetch('/api/transactions', { pollMs: POLL_MS });

    const isLoading = meds.isLoading || tx.isLoading;
    const error = meds.error || tx.error;

    if (isLoading || error) {
        return <PageState isLoading={isLoading} error={error} />;
    }

    const medicines = Array.isArray(meds.data) ? meds.data : [];
    const transactions = Array.isArray(tx.data) ? tx.data : [];

    const dailyConsumption = makeDailyConsumption(transactions);
    const recentConsumption = new Set(dailyConsumption.map((day) => day.key));

    const consumedTransactions = transactions.filter((transaction) => {
        if (transaction.type !== 'CONSUMED' || !transaction.timestamp) return false;
        const date = new Date(transaction.timestamp);
        return !Number.isNaN(date.getTime()) && recentConsumption.has(getDateKey(date));
    });

    const totalUnits = medicines.reduce(
        (total, medicine) => total + (Number(medicine.quantity) || 0),
        0
    );

    const totalUsed = consumedTransactions.reduce(
        (total, transaction) => total + (Number(transaction.quantity) || 0),
        0
    );

    const averagePerDay = (totalUsed / DAYS_TO_SHOW).toFixed(1);

    const statusParts = Object.keys(STATUS_COLOR).map((status) => ({
        key: status,
        name: STATUS_LABEL[status],
        color: STATUS_COLOR[status],
        value: medicines.filter((medicine) => medicine.status === status).length,
    }));

    const sourceCounts = consumedTransactions.reduce((counts, transaction) => {
        const source = transaction.source || 'UNKNOWN';
        counts[source] = (counts[source] || 0) + 1;
        return counts;
    }, {});

    const sources = Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        label: source.toLowerCase().replaceAll('_', ' '),
        count,
    }));

    const sourceMax = Math.max(...sources.map((source) => source.count), 1);

    const maxStockValue = Math.max(
        ...medicines.flatMap((medicine) => [
            Number(medicine.quantity) || 0,
            Number(medicine.minThreshold) || 0,
        ]),
        1
    );

    return (
        <div className="relative isolate space-y-5 sm:space-y-6">
            {/* Soft grid decoration that stays behind the content on all screen sizes. */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-10 opacity-50"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(34,197,94,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,.045) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    maskImage: 'linear-gradient(to bottom, black, transparent 90%)',
                }}
            />

            <header>
                <Link
                    to="/"
                    className="mb-2 inline-flex min-h-8 items-center gap-1 text-sm font-medium text-green-700 hover:underline"
                >
                    <ArrowLeft size={14} />
                    Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Tablet analytics
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Medicine usage and stock levels from the latest data in your backend.
                </p>
            </header>

            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Kpi icon={Boxes} label="Medicines tracked" value={medicines.length} />
                <Kpi icon={Layers} label="Units on the shelf" value={totalUnits} />
                <Kpi icon={TrendingDown} label={`Units used (${DAYS_TO_SHOW} days)`} value={totalUsed} />
                <Kpi icon={Gauge} label="Average used per day" value={averagePerDay} />
            </section>

            <ChartCard
                title="Units used per day"
                subtitle="Recorded consumption · rolling 14-day period"
            >
                <div className="h-56 w-full sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={dailyConsumption}
                            margin={{ top: 8, right: 8, bottom: 0, left: -22 }}
                        >
                            <defs>
                                <linearGradient id="unitsFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.015} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 4" vertical={false} />
                            <XAxis
                                dataKey="label"
                                interval="preserveStartEnd"
                                minTickGap={14}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                width={38}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                formatter={(value) => [`${value} units`, 'Consumed']}
                                labelFormatter={(label) => `Date: ${label}`}
                                contentStyle={{
                                    border: '1px solid #dcfce7',
                                    borderRadius: 12,
                                    fontSize: 12,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="units"
                                name="Units consumed"
                                stroke="#16a34a"
                                strokeWidth={2.5}
                                fill="url(#unitsFill)"
                                activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            <div className="grid min-w-0 gap-5 lg:grid-cols-2">
                <ChartCard title="Stock level vs minimum">
                    {medicines.length === 0 ? (
                        <p className="py-6 text-sm text-slate-500">No medicines found.</p>
                    ) : (
                        <ul className="max-h-[26rem] space-y-4 overflow-y-auto pr-1">
                            {medicines.map((medicine) => {
                                const quantity = Number(medicine.quantity) || 0;
                                const minimum = Number(medicine.minThreshold) || 0;
                                const quantityWidth = Math.min((quantity / maxStockValue) * 100, 100);
                                const minimumPosition = Math.min((minimum / maxStockValue) * 100, 100);
                                const color = STATUS_COLOR[medicine.status] || '#22c55e';

                                return (
                                    <li key={medicine.id} className="min-w-0">
                                        <div className="mb-1 flex min-w-0 items-center justify-between gap-3 text-xs text-slate-600">
                                            <span className="truncate font-medium">{medicine.name}</span>
                                            <span className="shrink-0">
                                                {quantity} <span className="text-slate-400">/ min {minimum}</span>
                                            </span>
                                        </div>
                                        <div
                                            className="relative h-2.5 rounded-full bg-slate-100"
                                            role="img"
                                            aria-label={`${medicine.name}: ${quantity} units, minimum ${minimum}`}
                                        >
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${quantityWidth}%`, backgroundColor: color }}
                                            />
                                            <div
                                                className="absolute -top-1 h-[18px] w-0.5 bg-slate-500"
                                                style={{ left: `${minimumPosition}%` }}
                                                title="Minimum stock threshold"
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <p className="mt-4 text-xs text-slate-400">
                        The marker shows each medicine’s minimum stock threshold.
                    </p>
                </ChartCard>

                <div className="grid min-w-0 gap-5">
                    <ChartCard title="Stock status">
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
                            <div className="h-40 w-40 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusParts}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius="62%"
                                            outerRadius="88%"
                                            paddingAngle={statusParts.filter((part) => part.value > 0).length > 1 ? 3 : 0}
                                            stroke="none"
                                        >
                                            {statusParts.map((part) => (
                                                <Cell key={part.key} fill={part.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [`${value} medicines`, name]}
                                            contentStyle={{
                                                border: '1px solid #dcfce7',
                                                borderRadius: 12,
                                                fontSize: 12,
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <ul className="grid w-full grid-cols-1 gap-2 text-sm sm:w-auto">
                                {statusParts.map((part) => (
                                    <li key={part.key} className="flex items-center justify-between gap-4 text-slate-600">
                                        <span className="flex min-w-0 items-center gap-2">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-full"
                                                style={{ backgroundColor: part.color }}
                                            />
                                            <span className="truncate">{part.name}</span>
                                        </span>
                                        <b className="text-slate-900">{part.value}</b>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ChartCard>

                    <ChartCard
                        title="How updates were entered"
                        subtitle="Count of consumption transactions by source"
                    >
                        {sources.length === 0 ? (
                            <p className="py-3 text-sm text-slate-500">
                                No consumption transactions in this period.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {sources.map(({ source, label, count }) => (
                                    <li key={source} className="flex min-w-0 items-center gap-3 text-xs text-slate-600">
                                        <span className="w-16 shrink-0 truncate capitalize">{label}</span>
                                        <div className="h-2.5 min-w-0 flex-1 rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-green-500 transition-all"
                                                style={{ width: `${(count / sourceMax) * 100}%` }}
                                            />
                                        </div>
                                        <span className="w-8 shrink-0 text-right font-medium text-slate-900">
                                            {count}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </ChartCard>
                </div>
            </div>

            <section className="space-y-3">
                <div>
                    <h2 className="font-semibold text-slate-900">Security audit log</h2>
                    <p className="text-sm text-slate-500">
                        Download recent backend request activity.
                    </p>
                </div>
                <DownloadAuditLogButton />
            </section>

        </div>
    );
}