'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '../LangProvider';
import { useDashboardData } from './DashboardProvider';

const STATUS_COLORS: Record<string, string> = {
  open:      '#c8973f',
  confirmed: '#4a90e2',
  preparing: '#f5a623',
  ready:     '#7ed321',
  completed: '#50e3c2',
  cancelled: '#d0021b',
  refunded:  '#9b59b6',
};

const STATUS_KEYS: Record<string, string> = {
  open:      'open',
  confirmed: 'confirmed',
  preparing: 'preparing',
  ready:     'ready',
  completed: 'completed',
  cancelled: 'cancelled',
  refunded:  'refunded',
};

// Display order
const STATUS_ORDER = ['open', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled', 'refunded'];

export function StatusSummary() {
  const { t } = useLang();
  const { data, loading } = useDashboardData();
  const listRef = useRef<HTMLDivElement>(null);

  const summary = data?.status_summary || {};
  const statusData = STATUS_ORDER
    .filter((s) => summary[s] !== undefined)
    .map((status) => ({
      status,
      statusKey: STATUS_KEYS[status] || status,
      count: summary[status] || 0,
      color: STATUS_COLORS[status] || '#999',
    }));

  const total = statusData.reduce((s, d) => s + d.count, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.querySelectorAll<HTMLElement>('.status-bar-fill').forEach((el) => {
        el.style.width = `${el.dataset.target}%`;
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [statusData.length, total]);

  if (loading) {
    return (
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">{t('order_status')}</div>
            <div className="section-sub">{t('distribution')}</div>
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
          <div className="section-title">{t('order_status')}</div>
          <div className="section-sub">{t('distribution')}</div>
        </div>
      </div>
      <div className="status-list" ref={listRef}>
        {statusData.map((d) => {
          const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
          return (
            <div key={d.status} className="status-row">
              <div className="status-dot" style={{ background: d.color }} />
              <span className="status-label">{t(d.statusKey as any)}</span>
              <div className="status-bar-wrap">
                <div
                  className="status-bar-fill"
                  style={{ width: '0%', background: d.color }}
                  data-target={pct}
                />
              </div>
              <span className="status-pct">{pct}%</span>
            </div>
          );
        })}
      </div>
      <div className="status-counts">
        {statusData.map((d) => (
          <div key={d.status} className="status-count-card">
            <div className="status-count-val" style={{ color: d.color }}>{d.count}</div>
            <div className="status-count-label">{t(d.statusKey as any)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
