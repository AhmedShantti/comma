'use client';

import { useLang } from '../LangProvider';
import { useDashboardData } from './DashboardProvider';

const STAT_ICONS = {
  revenue: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />',
  orders: '<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />',
  average: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />',
  items: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />',
};

export function StatCards() {
  const { t } = useLang();
  const { data, loading, error, refresh } = useDashboardData();

  if (loading) {
    return (
      <div className="stats-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="stat-card skeleton" style={{ animationDelay: `${i * 0.07}s` }} />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'center' }}>
        {error || 'No data available'}
        <button
          onClick={refresh}
          style={{ marginTop: '8px', padding: '4px 12px', cursor: 'pointer' }}
          className="btn-ghost"
        >
          Retry
        </button>
      </div>
    );
  }

  const sc = data.stat_cards;
  const g = sc.growth;

  const stats = [
    {
      labelKey: 'total_revenue',
      value: `${t('egp')} ${sc.total_revenue.toLocaleString()}`,
      change: `${g.revenue_pct >= 0 ? '↑' : '↓'} ${Math.abs(g.revenue_pct)}%`,
      up: g.revenue_pct >= 0,
      icon: STAT_ICONS.revenue,
    },
    {
      labelKey: 'total_orders',
      value: sc.total_orders.toString(),
      change: `${g.orders_pct >= 0 ? '↑' : '↓'} ${Math.abs(g.orders_pct)}%`,
      up: g.orders_pct >= 0,
      icon: STAT_ICONS.orders,
    },
    {
      labelKey: 'average_order',
      value: `${t('egp')} ${sc.average_order_value.toLocaleString()}`,
      change: `${g.avg_order_pct >= 0 ? '↑' : '↓'} ${Math.abs(g.avg_order_pct)}%`,
      up: g.avg_order_pct >= 0,
      icon: STAT_ICONS.average,
    },
    {
      labelKey: 'items_sold',
      value: sc.items_sold.toString(),
      change: `${g.items_sold_pct >= 0 ? '↑' : '↓'} ${Math.abs(g.items_sold_pct)}%`,
      up: g.items_sold_pct >= 0,
      icon: STAT_ICONS.items,
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <div key={s.labelKey} className="stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
          <div className="stat-top">
            <div className="stat-icon">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                dangerouslySetInnerHTML={{ __html: s.icon }}
              />
            </div>
            <span className={`stat-change ${s.up ? 'up' : 'down'}`}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d={s.up ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
              </svg>
              {s.change}
            </span>
          </div>
          <div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{t(s.labelKey as any)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
