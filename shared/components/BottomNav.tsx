'use client';

import Link from 'next/link';

interface BottomNavProps {
  active: 'home' | 'stamp' | 'redeem';
}

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const CupIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2.18c.07-.31.18-.61.18-.93C18 3.38 16.62 2 15.07 2c-.95 0-1.76.5-2.28 1.22L12 4.5l-.79-1.28C10.69 2.5 9.88 2 8.93 2 7.38 2 6 3.38 6 4.93c0 .32.11.62.18.93H4c-1.11 0-2 .89-2 2v1c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8c0-1.11-.89-2-2-2zm-12.93-.5C7.07 5.5 7 5.22 7 4.93 7 3.93 7.93 3 8.93 3c.48 0 .88.2 1.17.5l.9 1.5H7.07zM17 4.93c0 .29-.07.57-.07.57H14l.9-1.5C15.19 3.2 15.59 3 16.07 3 17.07 3 18 3.93 18 4.93zM5 19c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-9H5v9zm8-7h2v7h-2v-7zm-4 0h2v7H9v-7zm-2 0h2v7H7v-7z"/>
  </svg>
);

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <Link href="/home" className={`bottom-nav-item ${active === 'home' ? 'active' : ''}`}>
        <HomeIcon />
        Inicio
      </Link>
      <Link href="/stamp" className={`bottom-nav-item ${active === 'stamp' ? 'active' : ''}`}>
        <CupIcon />
        Sello
      </Link>
      <Link href="/redeem" className={`bottom-nav-item ${active === 'redeem' ? 'active' : ''}`}>
        <GiftIcon />
        Premio
      </Link>
    </nav>
  );
}
