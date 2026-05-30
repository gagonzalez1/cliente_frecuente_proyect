'use client';

import { useRouter } from 'next/navigation';
import BottomNav from '@/shared/components/BottomNav';
import TenantProvider from '@/features/tenant/components/TenantProvider';
import StampValidation from '@/features/stamps/components/StampValidation';

export default function StampPageWrapper() {
  const router = useRouter();

  return (
    <TenantProvider>
      <div className="app-shell">
        <div className="top-header">
          <button className="btn btn-ghost" style={{ padding: '8px 0' }} onClick={() => router.back()}>
            ← Volver
          </button>
        </div>
        <StampValidation />
        <BottomNav active="stamp" />
      </div>
    </TenantProvider>
  );
}
