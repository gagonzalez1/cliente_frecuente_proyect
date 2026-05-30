'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/shared/lib/app-context';
import { useEffect } from 'react';

export default function LoginScreen() {
  const { isLoggedIn, login, tenant } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.push('/home');
  }, [isLoggedIn, router]);

  const handleLogin = () => {
    login();
    router.push('/home');
  };

  return (
    <div className="login-bg" style={{ '--color-secondary': tenant.colorSecondary, '--color-primary': tenant.colorPrimary } as React.CSSProperties}>
      <div className="login-logo-ring">
        ☕
      </div>

      <h1 className="text-2xl text-center" style={{ marginBottom: 8 }}>
        {tenant.name}
      </h1>
      <p className="text-base text-muted text-center" style={{ marginBottom: 48, maxWidth: 280 }}>
        Tu tarjeta de fidelización digital. Donde cada café te acerca a tu premio.
      </p>

      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn btn-primary btn-full btn-lg" onClick={handleLogin}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <p className="text-xs text-muted text-center" style={{ marginTop: 8 }}>
          Al continuar aceptas los términos de servicio
        </p>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 48, textAlign: 'center' }}>
        <p className="text-xs text-muted">¿Sos el barista?&nbsp;
          <a href="/barista" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Panel de Mostrador →</a>
        </p>
        <p className="text-xs text-muted" style={{ marginTop: 4 }}>¿Sos el dueño?&nbsp;
          <a href="/owner" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Dashboard →</a>
        </p>
      </div>
    </div>
  );
}
