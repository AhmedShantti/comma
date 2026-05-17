'use client';

import { useEffect, useRef } from 'react';
import { CAT_DATA, CATEGORIES } from '@/lib/data';
import { useLang } from '../LangProvider';
import type { UIKey } from '@/lib/i18n';
import type { CategorySlug } from '@/lib/types';

const CAT_KEY: Record<CategorySlug, UIKey> = {
  'coffees': 'cat_coffees',
  'hot-drinks': 'cat_hot_drinks',
  'cold-drinks': 'cat_cold_drinks',
  'fresh-juices': 'cat_fresh_juices',
  'smoothies': 'cat_smoothies',
  'desserts': 'cat_desserts',
  'shisha': 'cat_shisha',
  'snacks': 'cat_snacks',
};

export function CategoryBars() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.querySelectorAll<HTMLElement>('.cat-bar-fill').forEach((el) => {
        el.style.width = `${el.dataset.target}%`;
      });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="section-card">
      <div className="section-head">
        <div>
          <div className="section-title">{t('orders_by_category')}</div>
          <div className="section-sub">{t('total_this_week')}</div>
        </div>
      </div>
      <div className="chart-body">
        <div ref={ref}>
          <div className="cat-bar-list">
            {CAT_DATA.map((d) => (
              <div key={d.catSlug} className="cat-bar-row">
                <div className="cat-bar-top">
                  <span className="cat-bar-name">{t(CAT_KEY[d.catSlug])}</span>
                  <span className="cat-bar-val">{d.val}</span>
                </div>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width: '0%' }} data-target={d.pct} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
