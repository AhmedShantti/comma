'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { useLang } from '../LangProvider';
import { LangToggle } from '../LangToggle';
import type { UIKey } from '@/lib/i18n';

type Props = { children: React.ReactNode };

const PAGE_TITLE_KEY: Record<string, UIKey> = {
  '/dashboard': 'dashboard',
  '/dashboard/orders': 'orders',
  '/dashboard/analytics': 'analytics',
  '/dashboard/settings': 'settings',
};

export function AdminShell({ children }: Props) {
  const { lang, t } = useLang();
  const pathname = usePathname();
  const pageTitle = t(PAGE_TITLE_KEY[pathname] ?? 'dashboard');
  const [open, setOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState('');

  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, [lang]);

  return (
    <>
      <div
        className={`sidebar-overlay${open ? ' visible' : ''}`}
        onClick={() => setOpen(false)}
      />

      <div className="admin-layout">
        <Sidebar open={open} />

        <div className="admin-main">
          <header className="admin-topbar">
            <div>
              <button
                className="menu-toggle"
                aria-label="Open sidebar"
                onClick={() => setOpen((v) => !v)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <p className="page-title">{pageTitle}</p>
              <p className="page-date">{dateLabel}</p>
            </div>
            <div className="topbar-right">
              <LangToggle />
              <Link href="/" className="view-menu-btn">{t('view_menu')}</Link>
              <div className="live-badge">
                <span className="live-dot" />
                {t('live')}
              </div>
            </div>
          </header>

          <div className="admin-content">{children}</div>
        </div>
      </div>
    </>
  );
}
