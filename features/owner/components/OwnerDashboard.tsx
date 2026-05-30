'use client';

import { useApp } from '@/shared/lib/app-context';
import KpiCard from './KpiCard';
import FunnelChart from './FunnelChart';

/**
 * OwnerDashboard — Panel administrativo del dueño
 */
export default function OwnerDashboard() {
  const { tenant } = useApp();

  return (
    <div className="app-shell" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h1 className="text-3xl" style={{ fontWeight: 800 }}>Dashboard: {tenant.name}</h1>
          <p className="text-muted">Resumen de actividad y performance de lealtad</p>
        </div>
        <a href="/owner/brand" className="btn btn-secondary">
          ⚙️ Configurar Marca
        </a>
      </header>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        <KpiCard label="Clientes Totales" value="1,240" trend={{ value: '12%', positive: true }} />
        <KpiCard label="Sellos Hoy" value="84" trend={{ value: '5%', positive: true }} />
        <KpiCard label="Premios Entregados" value="156" trend={{ value: '2%', positive: false }} />
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <FunnelChart />

        <div className="card">
          <h3 className="text-lg" style={{ marginBottom: 24 }}>Proyecciones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p className="text-sm text-muted">Aumento estimado en ventas</p>
              <p className="text-2xl" style={{ color: '#4ade80' }}>+18.5%</p>
            </div>
            <div>
              <p className="text-sm text-muted">Tasa de retorno de clientes</p>
              <p className="text-2xl" style={{ color: 'var(--color-secondary)' }}>64%</p>
            </div>
            <div className="card-glass" style={{ marginTop: 12 }}>
              <p className="text-xs text-muted">
                Tus clientes más fieles visitan el local un promedio de 2.4 veces por semana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
