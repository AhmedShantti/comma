'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { LangToggle } from '../LangToggle';

export function Header() {
  const { t } = useLang();
  const [cafeName, setCafeName] = useState('C O M M A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settings.get();
        if (data?.cafe_name) {
          setCafeName(data.cafe_name);
        }
      } catch {
        // use default
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <span className="brand">{cafeName}</span>
          <nav className="nav-links" style={{ gap: 12 }}>
            <Link href="/" className="active">{t('menu')}</Link>
            <LangToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
