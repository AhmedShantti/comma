'use client';

import { STATS } from '@/lib/data';
import { useLang } from '../LangProvider';

export function StatCards() {
  const { t } = useLang();
  return (
    <div className="stats-grid">
      {STATS.map((s, i) => (
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
            <div className="stat-label">{t(s.labelKey)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
