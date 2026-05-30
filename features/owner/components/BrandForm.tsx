'use client';

import { useApp } from '@/shared/lib/app-context';

/**
 * BrandForm — Formulario de configuración de identidad de marca
 */
export default function BrandForm() {
  const { tenant, updateTenant } = useApp();

  return (
    <div className="card">
      <h2 className="text-xl" style={{ marginBottom: 24 }}>Identidad Visual</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="form-group">
          <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 8 }}>Nombre de la marca</label>
          <input
            type="text"
            className="btn-full"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-surface-3)', borderRadius: 8, padding: 12, color: 'white' }}
            value={tenant.name}
            onChange={(e) => updateTenant({ name: e.target.value })}
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 8 }}>Color Primario</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="color"
                value={tenant.colorPrimary}
                onChange={(e) => updateTenant({ colorPrimary: e.target.value })}
                style={{ width: 44, height: 44, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }}
              />
              <code className="text-xs">{tenant.colorPrimary}</code>
            </div>
          </div>

          <div className="form-group">
            <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 8 }}>Color Secundario</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="color"
                value={tenant.colorSecondary}
                onChange={(e) => updateTenant({ colorSecondary: e.target.value })}
                style={{ width: 44, height: 44, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }}
              />
              <code className="text-xs">{tenant.colorSecondary}</code>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-surface-3)', paddingTop: 24, marginTop: 8 }}>
          <p className="text-sm text-muted" style={{ marginBottom: 16 }}>Configuración de Recompensas</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sm">Sellos necesarios para premio</span>
            <select
              value={tenant.totalStampsRequired}
              onChange={(e) => updateTenant({ totalStampsRequired: parseInt(e.target.value) })}
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-surface-3)', borderRadius: 8, padding: '8px 12px', color: 'white' }}
            >
              {[5, 8, 10, 12].map(n => <option key={n} value={n}>{n} sellos</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
