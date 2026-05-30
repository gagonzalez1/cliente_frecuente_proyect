'use client';

import { useApp } from '@/shared/lib/app-context';
import TokenDisplay from './TokenDisplay';
import ActiveRewardsList from './ActiveRewardsList';

/**
 * BaristaTerminal — Interfaz del barista para el mostrador
 */
export default function BaristaTerminal() {
  const { currentToken, activeRewards, burnReward } = useApp();

  return (
    <div className="app-shell" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-2xl">Panel de Mostrador</h1>
          <p className="text-muted">Gestión de sellos y premios en tiempo real</p>
        </div>
        <div className="badge badge-outline">Barista: Villa Crespo</div>
      </header>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.5fr', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <TokenDisplay code={currentToken.code} />
          
          <div className="card-glass">
            <h4 className="text-sm" style={{ marginBottom: 16 }}>Instrucciones</h4>
            <ul className="text-xs text-muted" style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 16 }}>
              <li>Mostrá el código de arriba al cliente para que sume su sello.</li>
              <li>Cuando un cliente canjee, aparecerá en la lista de la derecha.</li>
              <li>Verificá que las palabras coincidan con las de su celular.</li>
              <li>Presioná "Entregar" para completar el proceso.</li>
            </ul>
          </div>
        </div>

        <ActiveRewardsList rewards={activeRewards} onBurn={burnReward} />
      </div>
    </div>
  );
}
