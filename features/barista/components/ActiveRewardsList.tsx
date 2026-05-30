'use client';

import { ActiveReward } from '@/shared/lib/app-context';

interface ActiveRewardsListProps {
  rewards: ActiveReward[];
  onBurn: (id: string) => void;
}

/**
 * ActiveRewardsList — Lista de premios pendientes de entrega
 */
export default function ActiveRewardsList({ rewards, onBurn }: ActiveRewardsListProps) {
  const pendingRewards = rewards.filter(r => r.status === 'PENDING');

  return (
    <div className="card" style={{ minHeight: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 className="text-lg">Premios por entregar</h3>
        <span className="badge badge-secondary">{pendingRewards.length} pendientes</span>
      </div>

      {pendingRewards.length === 0 ? (
        <div style={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
          <span style={{ fontSize: 48, marginBottom: 16 }}>☕</span>
          <p>No hay canjes activos en este momento</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pendingRewards.map((reward) => (
            <div key={reward.id} className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'slideIn 0.3s ease-out' }}>
              <div>
                <p className="text-xs text-muted" style={{ marginBottom: 4 }}>
                  SOLICITADO {new Date(reward.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-secondary)' }}>
                  {reward.words}
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => onBurn(reward.id)}>
                Entregar premio
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
