'use client';

import { useApp } from '@/shared/lib/app-context';
import { useEffect } from 'react';

export default function TenantProvider({ children }: { children: React.ReactNode }) {
  const { tenant } = useApp();

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', tenant.colorPrimary);
    document.documentElement.style.setProperty('--color-secondary', tenant.colorSecondary);
    document.documentElement.style.setProperty('--color-accent', tenant.colorAccent);
  }, [tenant]);

  return <>{children}</>;
}
