'use client';

import { useEffect, useRef } from 'react';
import { STATUS_DATA } from '@/lib/data';
import { useLang } from '../LangProvider';

export function StatusSummary() {
  const { t } = useLang();
  const listRef = useRef<HTMLDivElement>(null);
  const total = STATUS_DATA.reduce((s, d) => s + d.count, 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.querySelectorAll<HTMLElement>('.status-bar-fill').forEach((el) => {
        el.style.width = `${el.dataset.target}%`;
      });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="section-card">
      <div className="section-head">
        <div>
          <div className="section-title">{t('order_status')}</div>
          <div className="section-sub">{t('distribution')}</div>
        </div>
      </div>
      <div className="status-list" ref={listRef}>
        {STATUS_DATA.map((d) => {
          const pct = Math.round((d.count / total) * 100);
          return (
            <div key={d.status} className="status-row">
              <div className="status-dot" style={{ background: d.color }} />
              <span className="status-label">{t(d.statusKey)}</span>
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
        {STATUS_DATA.map((d) => (
          <div key={d.status} className="status-count-card">
            <div className="status-count-val" style={{ color: d.color }}>{d.count}</div>
            <div className="status-count-label">{t(d.statusKey)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
