'use client';

/**
 * FunnelChart — Visualización del embudo de retención de clientes
 */
export default function FunnelChart() {
  const steps = [
    { label: 'Clientes Totales', value: 1240, width: '100%' },
    { label: 'Con 1+ Sellos', value: 890, width: '70%' },
    { label: 'Con 3+ Sellos', value: 450, width: '40%' },
    { label: 'Premios Canjeados', value: 120, width: '25%' },
  ];

  return (
    <div className="card">
      <h3 className="text-lg" style={{ marginBottom: 24 }}>Embudo de Retención</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((step, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="text-sm text-muted">{step.label}</span>
              <span className="text-sm" style={{ fontWeight: 600 }}>{step.value}</span>
            </div>
            <div style={{ height: 24, background: 'var(--color-surface-3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: step.width,
                background: 'linear-gradient(90deg, var(--color-secondary), #a07840)',
                opacity: 1 - i * 0.15,
                transition: 'width 1s ease-out',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
