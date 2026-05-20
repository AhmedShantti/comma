'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { LangToggle } from '../LangToggle';
import { Logo } from '../Logo';

export function Header() {
  const { t } = useLang();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        await api.settings.get();
      } catch {
        // use default
      }
    };
    fetchSettings();
  }, []);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <Logo href="/" width={50} height={50} />
          <nav className="nav-links" style={{ gap: 12 }}>
            <a href="/" className="active">{t('menu')}</a>
            <LangToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
