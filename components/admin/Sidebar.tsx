'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLang } from '../LangProvider';
import { useAuth } from '../AuthProvider';
import { canAccess } from '@/lib/auth';
import type { UIKey } from '@/lib/i18n';

type Props = { open: boolean };

type NavItem = {
  href: string;
  labelKey: UIKey;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  {
    href: '/dashboard',
    labelKey: 'dashboard',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/dashboard/menu',
    labelKey: 'menu',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
      </svg>
    ),
  },
  {
    href: '/dashboard/orders',
    labelKey: 'orders',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    href: '/dashboard/tables',
    labelKey: 'tables',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <line x1="3" y1="11" x2="21" y2="11" />
        <line x1="8" y1="17" x2="8" y2="21" />
        <line x1="16" y1="17" x2="16" y2="21" />
      </svg>
    ),
  },
  {
    href: '/dashboard/shifts',
labelKey: 'shifts',
icon: (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {/* Calendar */}
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />

    {/* Clock */}
    <circle cx="12" cy="15" r="4" />
    <line x1="12" y1="15" x2="12" y2="13" />
    <line x1="12" y1="15" x2="14" y2="16" />
  </svg>
)
  },
  {
    href: '/dashboard/analytics',
    labelKey: 'analytics',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    href: '/dashboard/reports',
    labelKey: 'reports',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    labelKey: 'settings',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const ROLE_LABEL_KEY: Record<string, string> = {
  admin:      'role_admin',
  manager:    'role_manager',
  cashier:    'role_cashier',
  accounting: 'role_accounting',
  garson:     'role_garson',
};

export function Sidebar({ open }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t } = useLang();
  const { user, logout } = useAuth();

  const visibleNav = NAV.filter((item) =>
    user ? canAccess(user.role, item.href) : false
  );

  async function handleLogout() {
    await logout();
  }

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-brand">C O M M A</span>
      </div>

      <p className="sidebar-section-label">{t('navigation')}</p>

      <nav className="sidebar-nav">
        {visibleNav.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={isActive ? 'active' : undefined}>
              {item.icon}
              {t(item.labelKey)}
              {isActive && <span className="active-dot" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <>
            <div className="sidebar-user">
              <div className="user-avatar">{user.name[lang].charAt(0)}</div>
              <div className="user-info">
                <div className="user-name">{user.name[lang]}</div>
                <div className="user-role">{t((ROLE_LABEL_KEY[user.role] ?? 'role_cashier') as any)}</div>
              </div>
            </div>
            <button type="button" className="sidebar-logout" onClick={handleLogout}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {t('logout')}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
