'use client';

import Link from 'next/link';
import { useLang } from '../LangProvider';
import { LangToggle } from '../LangToggle';

export function Header() {
  const { t } = useLang();
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <span className="brand">C O M M A</span>
          <nav className="nav-links" style={{ gap: 12 }}>
            <Link href="/" className="active">{t('menu')}</Link>
            <LangToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
