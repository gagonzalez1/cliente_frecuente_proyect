import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/shared/lib/app-context';
import ServiceWorkerRegistrar from '@/shared/components/ServiceWorkerRegistrar';
import DevToolsGeo from '@/shared/components/DevToolsGeo';

export const metadata: Metadata = {
  title: 'CoffeeLoyalty',
  description: 'Tu tarjeta de fidelización digital',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'CoffeeLoyalty' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppProvider>
          {children}
          {/* PWA: Service Worker (solo en producción) */}
          <ServiceWorkerRegistrar />
          {/* DevTools GPS — solo visible en NODE_ENV=development */}
          <DevToolsGeo />
        </AppProvider>
      </body>
    </html>
  );
}
