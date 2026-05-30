'use client';

import { useRouter } from 'next/navigation';
import StampGrid from './StampGrid';

interface StampCardProps {
  currentStamps: number;
  totalRequired: number;
}

/**
 * StampCard — Card principal de progreso de sellos
 */
export default function StampCard({ currentStamps, totalRequired }: StampCardProps) {
  const router = useRouter();
  const completed = currentStamps >= totalRequired;

  return (
    <div className="card" style={{ marginTop: 20, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span className="text-sm text-muted">Mis sellos</span>
        <span className="text-sm" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
          {currentStamps}/{totalRequired}
        </span>
      </div>

      <StampGrid currentStamps={currentStamps} totalRequired={totalRequired} />

      {/* Progress bar */}
      <div style={{
        height: 4, background: 'var(--color-surface-3)',
        borderRadius: 99, overflow: 'hidden', margin: '8px 0 16px',
      }}>
        <div style={{
          height: '100%',
          width: `${(currentStamps / totalRequired) * 100}%`,
          background: 'linear-gradient(90deg, var(--color-secondary), #a07840)',
          borderRadius: 99,
          transition: 'width 0.6s ease',
        }} />
      </div>

      {completed ? (
        <div style={{ textAlign: 'center' }}>
          <p className="text-sm text-muted" style={{ marginBottom: 12 }}>
            🎉 ¡Completaste tu tarjeta! Canjeá tu premio
          </p>
          <button
            className="btn btn-primary btn-full"
            onClick={() => router.push('/redeem')}
          >
            🎁 Canjear Premio
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted text-center">
          Te faltan {totalRequired - currentStamps} café{totalRequired - currentStamps !== 1 ? 's' : ''} para tu premio
        </p>
      )}
    </div>
  );
}
