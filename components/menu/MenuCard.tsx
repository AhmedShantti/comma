'use client';

import type { MenuItem } from '@/lib/types';
import { UI } from '@/lib/i18n';
import { useLang } from '../LangProvider';

type Props = { item: MenuItem; index: number; onClick?: (itemId: string) => void };

const CAT_KEY: Record<MenuItem['cat'], keyof typeof UI> = {
  'appetizers': 'cat_appetizers',
  'main-courses': 'cat_main_courses',
  'beverages': 'cat_beverages',
  'desserts': 'cat_desserts',
  'coffees': 'cat_coffees',
  'hot-drinks': 'cat_hot_drinks',
  'cold-drinks': 'cat_cold_drinks',
  'fresh-juices': 'cat_fresh_juices',
  'smoothies': 'cat_smoothies',
  'shisha': 'cat_shisha',
  'snacks': 'cat_snacks',
};

export function MenuCard({ item, index, onClick }: Props) {
  const { lang = 'en', t } = useLang();

  // Defensive checks for item properties
  if (!item || !item.name || !item.desc) {
    return null;
  }

  const itemName = item.name?.[lang] || item.name?.['en'] || 'Unnamed';
  const itemDesc = item.desc?.[lang] || item.desc?.['en'] || '';
  const catKey = item.cat ? CAT_KEY[item.cat as keyof typeof CAT_KEY] : 'cat_snacks';

  return (
    <article
      className="menu-card"
      onClick={() => {
        console.log('[MenuCard] Clicked item:', item.id, 'onClick handler:', !!onClick);
        onClick?.(item.id);
      }}
      style={{
        animationDelay: `${index * 0.045}s`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={e => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }
      }}
    >
      <div className="card-img-wrap">
        {item.img ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.img}
              alt={itemName}
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.parentElement) img.parentElement.style.background = 'var(--bg-elevated)';
                img.style.display = 'none';
              }}
            />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)' }}>
            <svg width="32" height="32" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        <div className="card-img-price">
          <span>{t('egp')} {item.price}</span>
        </div>
        {item.popular && <span className="popular-tag">{t('popular')}</span>}
      </div>
      <div className="card-body">
        <span className="card-category">{t(catKey || 'cat_snacks')}</span>
        <h3 className="card-name">{itemName}</h3>
        <p className="card-desc">{itemDesc}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="card-tags">
            {item.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="card-tag">{tag?.[lang] || tag?.['en'] || ''}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
