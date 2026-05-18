'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { useLang } from '../LangProvider';
import { LangToggle } from '../LangToggle';
import { useAuth } from '../AuthProvider';
import { api } from '@/lib/api';
import type { UIKey } from '@/lib/i18n';

type Props = { children: React.ReactNode };

const PAGE_TITLE_KEY: Record<string, UIKey> = {
  '/dashboard': 'dashboard',
  '/dashboard/orders': 'orders',
  '/dashboard/tables': 'tables',
  '/dashboard/analytics': 'analytics',
  '/dashboard/reports': 'reports',
  '/dashboard/settings': 'settings',
};

export function AdminShell({ children }: Props) {
  const { lang, t } = useLang();
  const { logout } = useAuth();
  const pathname = usePathname();
  const pageTitle = t(PAGE_TITLE_KEY[pathname] ?? 'dashboard');
  const [open, setOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState('');
  const [shiftOpen, setShiftOpen] = useState(false);
  const [showOpenShiftModal, setShowOpenShiftModal] = useState(false);
  const [openingCash, setOpeningCash] = useState('');
  const [openingError, setOpeningError] = useState('');

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

  useEffect(() => {
    const checkShift = async () => {
      try {
        const current = await api.shifts.current();
        if (current && current.id) {
          setShiftOpen(true);
        } else {
          setShowOpenShiftModal(true);
        }
      } catch (err) {
        if ((err as any)?.response?.status === 401) {
          await logout();
          return;
        }
        setShowOpenShiftModal(true);
      }
    };
    checkShift();
  }, [logout]);

  const handleOpenShift = async () => {
    try {
      setOpeningError('');
      const amount = parseFloat(openingCash);
      if (isNaN(amount) || amount < 0) {
        setOpeningError(t('validation_required'));
        return;
      }
      await api.shifts.create({ opening_cash: amount });
      setShiftOpen(true);
      setShowOpenShiftModal(false);
      setOpeningCash('');
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        await logout();
        return;
      }
      setOpeningError((err as any)?.message || 'Failed to open shift');
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay${open ? ' visible' : ''}`}
        onClick={() => setOpen(false)}
      />

      {showOpenShiftModal && (
        <div className="modal-overlay">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="section-title">{t('open_shift')}</div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowOpenShiftModal(false)}
                aria-label={t('cancel')}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-field">
                <label className="login-label">{t('opening_cash')}</label>
                <input
                  type="number"
                  min="0"
                  className="search-input"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  placeholder="0.00"
                  style={{ padding: '10px 14px' }}
                />
              </div>
              {openingError && <p className="login-error">{openingError}</p>}
            </div>
            <div className="modal-foot">
              <button type="button" className="btn-primary" onClick={handleOpenShift}>
                {t('open_shift')}
              </button>
            </div>
          </div>
        </div>
      )}

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
