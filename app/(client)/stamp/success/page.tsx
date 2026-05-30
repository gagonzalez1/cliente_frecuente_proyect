'use client';

import TenantProvider from '@/features/tenant/components/TenantProvider';
import StampSuccessScreen from '@/features/stamps/components/StampSuccessScreen';

export default function StampSuccessPage() {
  return (
    <TenantProvider>
      <div className="app-shell">
        <StampSuccessScreen />
      </div>
    </TenantProvider>
  );
}
