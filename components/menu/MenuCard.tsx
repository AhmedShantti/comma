'use client';

import type { MenuItem } from '@/lib/types';
import { UI } from '@/lib/i18n';
import { useLang } from '../LangProvider';

type Props = { item: MenuItem; index: number };

const CAT_KEY: Record<MenuItem['cat'], keyof typeof UI> = {
  'coffees': 'cat_coffees',
  'hot-drinks': 'cat_hot_drinks',
  'cold-drinks': 'cat_cold_drinks',
  'fresh-juices': 'cat_fresh_juices',
  'smoothies': 'cat_smoothies',
  'desserts': 'cat_desserts',
  'shisha': 'cat_shisha',
  'snacks': 'cat_snacks',
};

export function MenuCard({ item, index }: Props) {
  const { lang, t } = useLang();
  return (
    <article className="menu-card" style={{ animationDelay: `${index * 0.045}s` }}>
      <div className="card-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.img}
          alt={item.name[lang]}
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.parentElement) img.parentElement.style.background = 'var(--bg-elevated)';
            img.style.display = 'none';
          }}
        />
        <div className="card-img-price">
          <span>{t('egp')} {item.price}</span>
        </div>
        {item.popular && <span className="popular-tag">{t('popular')}</span>}
      </div>
      <div className="card-body">
        <span className="card-category">{t(CAT_KEY[item.cat])}</span>
        <h3 className="card-name">{item.name[lang]}</h3>
        <p className="card-desc">{item.desc[lang]}</p>
        {item.tags.length > 0 && (
          <div className="card-tags">
            {item.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="card-tag">{tag[lang]}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
