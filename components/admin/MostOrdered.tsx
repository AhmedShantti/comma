'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '../LangProvider';
import { useDashboardData } from './DashboardProvider';

const COLORS = [
  '#c8973f',
  '#c8973f',
  'rgba(200,151,63,0.75)',
  'rgba(200,151,63,0.6)',
  'rgba(200,151,63,0.45)',
  'rgba(200,151,63,0.3)',
];

export function MostOrdered() {
  const { lang, t } = useLang();
  const { data, loading } = useDashboardData();
  const ref = useRef<HTMLDivElement>(null);

  const items = (data?.most_ordered || []).map((item) => ({
    name: { en: item.name_en, ar: item.name_ar },
    orders: item.quantity,
    revenue: item.revenue,
    pct: item.percentage,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.querySelectorAll<HTMLElement>('.most-bar').forEach((el) => {
        el.style.width = `${el.dataset.target}%`;
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [items.length]);

  if (loading) {
    return (
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">{t('most_ordered')}</div>
            <div className="section-sub">{t('by_volume')}</div>
          </div>
        </div>
        <div style={{ padding: '16px', color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-head">
        <div>
          <div className="section-title">{t('most_ordered')}</div>
          <div className="section-sub">{t('by_volume')}</div>
        </div>
      </div>
      <div className="most-ordered-list" ref={ref}>
        {items.length > 0 ? (
          items.map((item, i) => (
            <div key={`${item.name.en}-${i}`} className="most-item">
              <span className="most-rank">{i + 1}</span>
              <div className="most-info">
                <div className="most-name">{item.name[lang]}</div>
                <div className="most-bar-wrap">
                  <div
                    className="most-bar"
                    style={{ width: '0%', background: COLORS[i % COLORS.length] }}
                    data-target={item.pct}
                  />
                </div>
              </div>
              <div className="most-meta">
                <div className="most-orders">{item.orders} {t('orders_unit')}</div>
                <div className="most-revenue">{t('egp')} {item.revenue.toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '16px', color: 'var(--text-muted)' }}>No data available</div>
        )}
      </div>
    </div>
  );
}
