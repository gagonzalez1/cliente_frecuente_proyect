'use client';

/**
 * DevTools — Panel de desarrollo para simular coordenadas GPS.
 * Solo se renderiza en NODE_ENV=development.
 * Activar/ocultar con el atajo de teclado: Ctrl+Shift+G
 *
 * Expone `window.__geoOverride` que es leído en lugar de navigator.geolocation
 * cuando está activo, permitiendo QA sin popups nativos.
 */

import { useState, useEffect, useCallback } from 'react';

export interface GeoOverride {
  lat: number;
  lng: number;
  label: string;
}

const PRESETS: GeoOverride[] = [
  { lat: -34.5954, lng: -58.4445, label: '✅ Dentro del local (Villa Crespo)' },
  { lat: -34.5960, lng: -58.4455, label: '✅ Dentro del local (Caballito)' },
  { lat: -34.6100, lng: -58.3900, label: '❌ Fuera del rango (~2km)' },
  { lat: -34.6037, lng: -58.3816, label: '❌ Centro porteño (~5km)' },
];

declare global {
  interface Window {
    __geoOverride: GeoOverride | null;
  }
}

export default function DevToolsGeo() {
  const [visible, setVisible] = useState(false);
  const [activePreset, setActivePreset] = useState<GeoOverride | null>(PRESETS[0]);

  // Inicializar override global al preset por defecto (dentro del local)
  useEffect(() => {
    window.__geoOverride = PRESETS[0];
  }, []);

  const toggle = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
      setVisible(v => !v);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', toggle);
    return () => window.removeEventListener('keydown', toggle);
  }, [toggle]);

  const selectPreset = (preset: GeoOverride | null) => {
    setActivePreset(preset);
    window.__geoOverride = preset;
  };

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {/* Botón flotante siempre visible en dev */}
      <button
        onClick={() => setVisible(v => !v)}
        title="DevTools GPS (Ctrl+Shift+G)"
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: activePreset?.label.startsWith('✅') ? '#166534' : '#7f1d1d',
          border: '2px solid rgba(255,255,255,0.2)',
          color: '#fff',
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        📍
      </button>

      {visible && (
        <div style={{
          position: 'fixed',
          bottom: 64,
          right: 16,
          zIndex: 9999,
          background: '#0f172a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          width: 280,
          boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          fontFamily: 'monospace',
        }}>
          <p style={{ color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            🔧 DevTools — GPS Override
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => selectPreset(preset)}
                style={{
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  border: '1px solid',
                  cursor: 'pointer',
                  background: activePreset?.label === preset.label
                    ? (preset.label.startsWith('✅') ? 'rgba(22,101,52,0.4)' : 'rgba(127,29,29,0.4)')
                    : 'rgba(255,255,255,0.04)',
                  borderColor: activePreset?.label === preset.label
                    ? (preset.label.startsWith('✅') ? '#16a34a' : '#dc2626')
                    : 'rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                }}
              >
                {preset.label}
                <br />
                <span style={{ color: '#64748b', fontSize: 10 }}>{preset.lat}, {preset.lng}</span>
              </button>
            ))}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 2 }}>
              <button
                onClick={() => selectPreset(null)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  background: activePreset === null ? 'rgba(100,116,139,0.3)' : 'rgba(255,255,255,0.04)',
                  borderColor: activePreset === null ? '#64748b' : 'rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                }}
              >
                🌐 Usar GPS real del navegador
              </button>
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: 10, marginTop: 10 }}>
            Ctrl+Shift+G para mostrar/ocultar · Solo en dev
          </p>
        </div>
      )}
    </>
  );
}
