'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TOTAL = 10;

export default function StampSuccessScreen() {
  const [count, setCount] = useState(TOTAL);
  const router = useRouter();

  useEffect(() => {
    if (count <= 0) {
      router.push('/home');
      return;
    }
    const timer = setInterval(() => setCount(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [count, router]);

  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference * (1 - count / TOTAL);

  return (
    <div className="page-center" style={{ gap: 32, textAlign: 'center' }}>
      <div className="success-pulse">
        <span className="success-cup">☕</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 className="text-2xl">¡Sello sumado!</h1>
        <p className="text-base text-muted">Mostrá esta pantalla al barista</p>
      </div>

      <div className="countdown-ring">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle className="bg" cx="60" cy="60" r="50" />
          <circle
            className="progress"
            cx="60" cy="60" r="50"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="countdown-number">{count}</div>
      </div>

      <div className="card-glass" style={{ width: '100%' }}>
        <p className="text-sm text-muted" style={{ marginBottom: 4 }}>
          ✨ ¡Gracias por tu compra!
        </p>
        <p className="text-base text-center">Se redirigirá automáticamente en <strong style={{ color: 'var(--color-secondary)' }}>{count}s</strong></p>
      </div>

      <button className="btn btn-ghost" onClick={() => router.push('/home')}>
        Ir al inicio →
      </button>
    </div>
  );
}
