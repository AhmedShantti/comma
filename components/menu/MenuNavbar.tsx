'use client';

import { useLang } from '../LangProvider';
import { LangToggle } from '../LangToggle';
import { Logo } from '../Logo';

interface MenuNavbarProps {
  tableId?: string;
  tableNumber?: number;
  cartItemCount: number;
  onCartClick: () => void;
}

export function MenuNavbar({ tableId, tableNumber, cartItemCount, onCartClick }: MenuNavbarProps) {
  const { lang } = useLang();

  return (
    <nav
      className="site-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
      }}
    >
      <div className="container">
        <div className="header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Logo and Table Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Logo href="/" width={50} height={50} />
            {tableNumber && (
              <div
                style={{
                  fontSize: '13px',
                  color: '#c9a84c',
                  fontWeight: 600,
                  borderLeft: '1px solid rgba(201, 168, 76, 0.3)',
                  paddingLeft: '16px',
                }}
              >
                📍 {lang === 'ar' ? `الطاولة ${tableNumber}` : `Table ${tableNumber}`}
              </div>
            )}
          </div>

          {/* Right: Cart and Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c9a84c',
                transition: 'all 0.2s ease',
                fontSize: '20px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#d4b85a';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#c9a84c';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
              title={lang === 'ar' ? 'السلة' : 'Cart'}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>

              {/* Cart Item Badge */}
              {cartItemCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#c9a84c',
                    color: '#0f0e0d',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    minWidth: '20px',
                  }}
                >
                  {cartItemCount}
                </div>
              )}
            </button>

            {/* Language Toggle */}
            <LangToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
