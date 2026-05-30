'use client';

import { useApp } from '@/shared/lib/app-context';
import StampGrid from '@/features/stamps/components/StampGrid';

/**
 * PhonePreview — Maqueta de celular para live preview del branding
 */
export default function PhonePreview() {
  const { tenant } = useApp();

  return (
    <div style={{ position: 'sticky', top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p className="text-sm text-muted" style={{ marginBottom: 20 }}>Live Preview (Mobile PWA)</p>

      <div className="phone-mockup" style={{
        '--preview-primary': tenant.colorPrimary,
        '--preview-secondary': tenant.colorSecondary
      } as React.CSSProperties}>
        <div className="phone-screen">
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ width: 100, height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--preview-secondary)' }} />
            </div>

            <div style={{ padding: '24px 16px', borderRadius: 16, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: '#666' }}>Mis sellos</span>
                <span style={{ fontSize: 10, color: 'var(--preview-secondary)', fontWeight: 700 }}>4/5</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, margin: '12px 0' }}>
                {[1, 1, 1, 1, 0].map((f, i) => (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: '50%', border: '2px solid',
                    borderColor: f ? 'var(--preview-secondary)' : '#333',
                    background: f ? 'rgba(200,169,110,0.1)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
                  }}>
                    {f ? '☕' : ''}
                  </div>
                ))}
              </div>

              <div style={{ height: 3, background: '#333', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '80%', background: 'var(--preview-secondary)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div style={{ height: 60, borderRadius: 12, background: '#1a1a1a' }} />
              <div style={{ height: 60, borderRadius: 12, background: '#1a1a1a' }} />
            </div>

            <div style={{
              marginTop: 20, height: 50, borderRadius: 25,
              background: 'linear-gradient(135deg, var(--preview-secondary), #a07840)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: 80, height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 4 }} />
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: 60,
            background: '#0a0a0a', borderTop: '1px solid #1a1a1a',
            display: 'flex', justifyContent: 'space-around', alignItems: 'center'
          }}>
            {[1, 0, 0].map((a, i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: a ? 'var(--preview-secondary)' : '#333' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
