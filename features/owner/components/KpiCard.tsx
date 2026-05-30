'use client';

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
}

export default function KpiCard({ label, value, trend }: KpiCardProps) {
  return (
    <div className="card">
      <p className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <p className="text-3xl" style={{ fontWeight: 700 }}>{value}</p>
        {trend && (
          <span className="text-xs" style={{ color: trend.positive ? '#4ade80' : '#f87171' }}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
