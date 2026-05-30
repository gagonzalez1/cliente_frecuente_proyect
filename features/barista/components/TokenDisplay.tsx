'use client';

import { useState, useEffect } from 'react';

/**
 * TokenDisplay — Muestra el código dinámico con cuenta regresiva
 */
export default function TokenDisplay({ code }: { code: string }) {
  const [timeLeft, setTimeLeft] = useState('03:45:12');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = 23 - now.getHours();
      const m = 59 - now.getMinutes();
      const s = 59 - now.getSeconds();
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <p className="text-sm text-muted" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
        Código Dinámico Actual
      </p>
      <h2 style={{ fontSize: 80, fontWeight: 800, color: 'var(--color-secondary)', lineHeight: 1, margin: '10px 0' }}>
        {code}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
        <p className="text-sm text-muted">Cambia en {timeLeft}</p>
      </div>
    </div>
  );
}
