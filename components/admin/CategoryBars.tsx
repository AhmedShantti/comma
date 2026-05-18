'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '../LangProvider';
import { useDashboardData } from './DashboardProvider';

export function CategoryBars() {
  const { lang, t } = useLang();
  const { data, loading } = useDashboardData();
  const ref = useRef<HTMLDivElement>(null);

  const categories = (data?.category_breakdown || []).map((cat) => ({
    name_en: cat.name_en,
    name_ar: cat.name_ar,
    val: cat.revenue.toLocaleString(),
    pct: cat.percentage,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.querySelectorAll<HTMLElement>('.cat-bar-fill').forEach((el) => {
        el.style.width = `${el.dataset.target}%`;
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [categories.length]);

  if (loading) {
    return (
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">{t('orders_by_category')}</div>
            <div className="section-sub">{t('total_this_week')}</div>
          </div>
        </div>
        <div className="chart-body skeleton" style={{ height: '200px' }} />
      </div>
    );
  }

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
            {categories.length > 0 ? (
              categories.map((d, i) => (
                <div key={`${d.name_en}-${i}`} className="cat-bar-row">
                  <div className="cat-bar-top">
                    <span className="cat-bar-name">
                      {lang === 'ar' ? d.name_ar : d.name_en}
                    </span>
                    <span className="cat-bar-val">{d.val}</span>
                  </div>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: '0%' }} data-target={d.pct} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', color: 'var(--text-muted)' }}>No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
