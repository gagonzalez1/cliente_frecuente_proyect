'use client';

import { useRouter } from 'next/navigation';
import BrandForm from './BrandForm';
import PhonePreview from './PhonePreview';

/**
 * BrandConfigScreen — Pantalla de configuración de marca
 */
export default function BrandConfigScreen() {
  const router = useRouter();

  return (
    <div className="app-shell" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: 40 }}>
        <button className="btn btn-ghost" style={{ padding: '8px 0', marginBottom: 12 }} onClick={() => router.back()}>
          ← Volver al Dashboard
        </button>
        <h1 className="text-3xl" style={{ fontWeight: 800 }}>Configuración de Marca</h1>
        <p className="text-muted">Personalizá cómo ven los clientes tu negocio en la PWA</p>
      </header>

      <div className="grid-2" style={{ gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'start', gap: 60 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <BrandForm />

          <div className="card-glass">
            <h4 className="text-sm" style={{ marginBottom: 12 }}>Sucursales Activadas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <div>
                  <p className="text-sm" style={{ fontWeight: 600 }}>Villa Crespo</p>
                  <p className="text-xs text-muted">Serrano 1234, CABA</p>
                </div>
                <span className="badge badge-secondary">Activa</span>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 12 }}>
              + Agregar sucursal (Próximamente)
            </button>
          </div>
        </div>

        <PhonePreview />
      </div>
    </div>
  );
}
