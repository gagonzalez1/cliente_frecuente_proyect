'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/shared/lib/app-context';
import { MOCK_BRANCH } from '@/shared/lib/mock-data';

/** Calcula distancia Haversine en metros entre dos coordenadas */
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Obtiene posición: usa window.__geoOverride en dev si está disponible */
function getPosition(): Promise<{ lat: number; lng: number }> {
  if (
    typeof window !== 'undefined' &&
    window.__geoOverride !== undefined &&
    window.__geoOverride !== null
  ) {
    return Promise.resolve({
      lat: window.__geoOverride.lat,
      lng: window.__geoOverride.lng,
    });
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('NO_GEOLOCATION'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 8000, maximumAge: 60000 }
    );
  });
}

export default function StampValidation() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'gps-error' | 'cooldown'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { addStamp, currentToken, lastStampTimestamp } = useApp();
  const router = useRouter();

  const handleValidate = async () => {
    if (code.length !== 3) return;

    if (lastStampTimestamp) {
      const hoursDiff = (Date.now() - lastStampTimestamp.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 5) {
        const hoursLeft = Math.ceil(5 - hoursDiff);
        setStatus('cooldown');
        setErrorMsg(`Ya sumaste un sello recientemente. Volvé a intentarlo en ${hoursLeft === 1 ? '1 hora' : `${hoursLeft} horas`}.`);
        return;
      }
    }

    setStatus('loading');

    try {
      const pos = await getPosition();
      const distance = haversineMeters(pos.lat, pos.lng, MOCK_BRANCH.latitude, MOCK_BRANCH.longitude);

      if (distance > MOCK_BRANCH.allowedRadiusMeters) {
        setStatus('error');
        setErrorMsg(`Debes estar en el local para sumar un sello. (Distancia: ${Math.round(distance)}m, máximo: ${MOCK_BRANCH.allowedRadiusMeters}m)`);
        return;
      }

      if (code.toUpperCase() !== currentToken.code.toUpperCase()) {
        setStatus('error');
        setErrorMsg('Código inválido. Verificá el código del mostrador e intentá de nuevo.');
        return;
      }

      const ok = addStamp();
      if (ok) {
        router.push('/stamp/success');
      } else {
        setStatus('cooldown');
        setErrorMsg('Ya sumaste un sello recientemente. Esperá 5 horas para el próximo.');
      }
    } catch (err: any) {
      if (err?.code === 1 || err?.message === 'NO_GEOLOCATION') {
        setStatus('gps-error');
        setErrorMsg('Necesitamos tu ubicación para verificar que estás en el local. Activá el GPS e intentá de nuevo.');
      } else {
        setStatus('gps-error');
        setErrorMsg('No pudimos obtener tu ubicación. Intentá de nuevo.');
      }
    }
  };

  const isError = ['error', 'gps-error', 'cooldown'].includes(status);

  return (
    <div className="page">
      <h1 className="text-xl" style={{ marginBottom: 8 }}>Cargar Sello</h1>
      <p className="text-sm text-muted" style={{ marginBottom: 32 }}>
        Ingresá el código de 3 caracteres que aparece en el mostrador
      </p>

      <input
        className="input-code"
        type="text"
        maxLength={3}
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
          if (isError) setStatus('idle');
        }}
        placeholder="—  —  —"
        autoFocus
        style={isError ? { borderColor: 'var(--color-error)' } : {}}
      />

      {isError && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: 'rgba(248, 113, 113, 0.1)',
          border: '1px solid rgba(248, 113, 113, 0.3)',
          borderRadius: 'var(--radius-md)',
        }}>
          <p className="text-sm text-error">
            {status === 'gps-error' && '📍 '}
            {status === 'cooldown' && '⏱️ '}
            {status === 'error' && '❌ '}
            {errorMsg}
          </p>
        </div>
      )}

      {status === 'idle' && (
        <div className="card-glass" style={{ marginTop: 24, textAlign: 'center' }}>
          <p className="text-sm text-muted">
            📍 Debés estar a menos de {MOCK_BRANCH.allowedRadiusMeters}m del local para validar
          </p>
        </div>
      )}

      {status === 'loading' && (
        <div style={{ textAlign: 'center', marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div className="spinner" style={{ width: 28, height: 28 }} />
          <p className="text-sm text-muted">Verificando ubicación...</p>
        </div>
      )}

      <button
        className="btn btn-primary btn-full btn-lg"
        style={{ marginTop: 32 }}
        onClick={handleValidate}
        disabled={code.length !== 3 || status === 'loading'}
      >
        {status === 'loading' ? 'Validando...' : 'Validar Sello'}
      </button>

      <div style={{
        marginTop: 32, padding: '16px', borderRadius: 'var(--radius-md)',
        background: 'rgba(200, 169, 110, 0.06)',
        border: '1px dashed rgba(200, 169, 110, 0.3)',
        textAlign: 'center',
      }}>
        <p className="text-xs text-muted">
          Demo: código válido → <strong style={{ color: 'var(--color-secondary)' }}>{currentToken.code}</strong>
        </p>
      </div>
    </div>
  );
}
