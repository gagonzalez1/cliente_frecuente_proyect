'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/shared/lib/app-context';
import { useEffect } from 'react';
import BottomNav from '@/shared/components/BottomNav';
import TenantProvider from '@/features/tenant/components/TenantProvider';
import StampCard from '@/features/stamps/components/StampCard';

/**
 * HomeScreen — Pantalla principal del cliente
 */
export default function HomeScreen() {
  const { isLoggedIn, user, tenant, currentStamps, totalRewardsEarned } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push('/');
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) return null;

  return (
    <TenantProvider>
      <div className="app-shell">
        {/* Header */}
        <div className="top-header">
          <div>
            <p className="text-sm text-muted">Hola,</p>
            <p className="text-xl">{user.alias}</p>
          </div>
          <img
            src={user.avatar}
            alt={user.alias}
            className="avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.alias}&background=c8a96e&color=000`;
            }}
          />
        </div>

        <div className="page">
          <StampCard 
            currentStamps={currentStamps} 
            totalRequired={tenant.totalStampsRequired} 
          />

          {/* Quick stats */}
          <div className="grid-2" style={{ marginTop: 16 }}>
            <div className="card" style={{ padding: '16px' }}>
              <p className="text-xs text-muted">Premios ganados</p>
              <p className="text-2xl" style={{ marginTop: 4 }}>{totalRewardsEarned}</p>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <p className="text-xs text-muted">Sucursal</p>
              <p className="text-sm" style={{ marginTop: 4, fontWeight: 600 }}>Villa Crespo</p>
              <p className="text-xs text-muted">Sellos compartidos</p>
            </div>
          </div>

          <div className="card-glass" style={{ marginTop: 16, textAlign: 'center' }}>
            <p className="text-sm text-muted">
              💡 Pedile el código al barista al pedir tu café
            </p>
          </div>
        </div>

        {/* FAB */}
        {currentStamps < tenant.totalStampsRequired && (
          <button
            onClick={() => router.push('/stamp')}
            style={{
              position: 'fixed',
              bottom: 90,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 40px)',
              maxWidth: 390,
              padding: '16px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-secondary), #a07840)',
              color: '#000',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(200, 169, 110, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              zIndex: 99,
            }}
          >
            + Cargar Sello
          </button>
        )}

        <BottomNav active="home" />
      </div>
    </TenantProvider>
  );
}
