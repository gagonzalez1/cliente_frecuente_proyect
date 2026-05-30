'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/shared/lib/app-context';
import BottomNav from '@/shared/components/BottomNav';
import TenantProvider from '@/features/tenant/components/TenantProvider';

type RedeemStatus = 'idle' | 'pending' | 'burned';

export default function RedeemScreen() {
  const { currentStamps, tenant, initiateReward, activeRewards } = useApp();
  const [status, setStatus] = useState<RedeemStatus>('idle');
  const [words, setWords] = useState('');
  const router = useRouter();

  const totalRequired = tenant.totalStampsRequired;
  const canRedeem = currentStamps >= totalRequired;

  const handleInitiate = () => {
    const w = initiateReward();
    setWords(w);
    setStatus('pending');
  };

  useEffect(() => {
    if (status === 'pending' && words) {
      const latest = activeRewards.find(r => r.words === words);
      if (latest?.status === 'BURNED') {
        setStatus('burned');
      }
    }
  }, [activeRewards, status, words]);

  if (!canRedeem) {
    return (
      <TenantProvider>
        <div className="app-shell">
          <div className="page-center" style={{ textAlign: 'center', gap: 20 }}>
            <span style={{ fontSize: 64 }}>🔒</span>
            <h1 className="text-xl">Todavía no hay premio</h1>
            <p className="text-base text-muted">
              Necesitás {totalRequired - currentStamps} sello{totalRequired - currentStamps !== 1 ? 's' : ''} más para canjear tu premio
            </p>
            <button className="btn btn-primary" onClick={() => router.push('/home')}>
              Volver al inicio
            </button>
          </div>
          <BottomNav active="redeem" />
        </div>
      </TenantProvider>
    );
  }

  if (status === 'burned') {
    return (
      <TenantProvider>
        <div className="app-shell">
          <div className="page-center" style={{ textAlign: 'center', gap: 24 }}>
            <div className="success-pulse">
              <span style={{ fontSize: 64 }}>🎉</span>
            </div>
            <h1 className="text-2xl">¡Premio entregado!</h1>
            <p className="text-base text-muted">A seguir sumando sellos 🚀</p>
            <button className="btn btn-primary btn-lg" onClick={() => router.push('/home')}>
              Volver al inicio
            </button>
          </div>
        </div>
      </TenantProvider>
    );
  }

  return (
    <TenantProvider>
      <div className="app-shell">
        <div className="top-header">
          <button className="btn btn-ghost" style={{ padding: '8px 0' }} onClick={() => router.back()}>
            ← Volver
          </button>
        </div>

        <div className="page-center" style={{ textAlign: 'center' }}>
          {status === 'idle' ? (
            <>
              <span style={{ fontSize: 80 }}>🎁</span>
              <div style={{ marginTop: 24 }}>
                <h1 className="text-2xl">¡Tiene premio!</h1>
                <p className="text-base text-muted" style={{ marginTop: 8, maxWidth: 280 }}>
                  Al presionar el botón se generará un código secreto para el barista
                </p>
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{ marginTop: 32, minWidth: 220 }}
                onClick={handleInitiate}
              >
                Generar código de canje
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Decile al barista
              </p>

              <div style={{ margin: '24px 0' }}>
                <p className="reward-words">{words || '...'}</p>
              </div>

              <div className="card-glass" style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div className="spinner" />
                  <p className="text-sm text-muted">Esperando validación en mostrador...</p>
                </div>
              </div>

              <div style={{
                marginTop: 24,
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(200, 169, 110, 0.06)',
                border: '1px dashed rgba(200, 169, 110, 0.3)',
                width: '100%',
              }}>
                <p className="text-xs text-muted" style={{ marginBottom: 8 }}>Demo: simulá que el barista confirmó el canje</p>
                <a
                  href="/barista"
                  className="btn btn-secondary btn-sm btn-full"
                >
                  Ir al panel del barista →
                </a>
              </div>
            </>
          )}
        </div>

        <BottomNav active="redeem" />
      </div>
    </TenantProvider>
  );
}
