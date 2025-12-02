'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname() || '/home';
  const tabs = [
    { id: 'home', label: '~/home', href: '/home' },
    { id: 'repos', label: '~/repos', href: '/repos' },
    { id: 'skills', label: '~/skills', href: '/skills' },
    { id: 'certs', label: '~/certs', href: '/certs' },
  ];

  return (
    <header>
      <div className="logo">&gt; thinh.dev_</div>
      <div className="nav-scroll">
        <nav className="nav-links">
          {tabs.map((tab) => {
            const isActive = (pathname === '/' && tab.href === '/home') || pathname.startsWith(tab.href);
            return (
              <Link key={tab.id} href={tab.href} className={`nav-item ${isActive ? 'active' : ''}`}>
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
