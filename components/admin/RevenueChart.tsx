'use client';

import { useLang } from '../LangProvider';
import { useDashboardData } from './DashboardProvider';

export function RevenueChart() {
  const { t } = useLang();
  const { data, loading } = useDashboardData();

  const W = 520;
  const H = 180;
  const pad = { top: 16, right: 16, bottom: 32, left: 56 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  const chartData = data?.revenue_chart || [];
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);

  if (loading || chartData.length === 0) {
    return (
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">{t('revenue_this_week')}</div>
            <div className="section-sub">{t('daily_revenue')}</div>
          </div>
        </div>
        <div className="chart-body" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          {loading ? 'Loading...' : 'No data for this week'}
        </div>
      </div>
    );
  }

  const vals = chartData.map((d) => d.revenue);
  const maxV = Math.max(...vals, 1);
  const minV = Math.min(...vals, 0);
  const range = maxV - minV || 1;

  const pts = vals.map((v, i) => ({
    x: pad.left + (i / Math.max(vals.length - 1, 1)) * cW,
    y: pad.top + cH - ((v - minV) / range) * cH,
  }));

  const linePath = pts
    .map((p, i) => {
      if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      const prev = pts[i - 1];
      const mx = (prev.x + p.x) / 2;
      return `C${mx.toFixed(1)},${prev.y.toFixed(1)} ${mx.toFixed(1)},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(' ');

  const last = pts[pts.length - 1];
  const areaPath =
    linePath +
    ` L${last.x.toFixed(1)},${(H - pad.bottom).toFixed(1)}` +
    ` L${pad.left.toFixed(1)},${(H - pad.bottom).toFixed(1)} Z`;

  const grid = [0, 0.33, 0.66, 1].map((pct, i) => {
    const y = pad.top + cH - pct * cH;
    const v = ((minV + range * pct) / 1000).toFixed(0);
    return (
      <g key={i}>
        <line x1={pad.left} y1={y.toFixed(1)} x2={W - pad.right} y2={y.toFixed(1)} stroke="#2a2218" strokeWidth="1" />
        <text x={pad.left - 8} y={(y + 4).toFixed(1)} textAnchor="end" fill="#6b6255" fontSize="10" fontFamily="DM Sans,sans-serif">
          {v}k
        </text>
      </g>
    );
  });

  return (
    <div className="section-card">
      <div className="section-head">
        <div>
          <div className="section-title">{t('revenue_this_week')}</div>
          <div className="section-sub">{t('daily_revenue')}</div>
        </div>
        <div className="section-meta">
          <div className="meta-value">{t('egp')} {totalRevenue.toLocaleString()}</div>
          <div className="meta-change">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 15l-6-6-6 6" />
            </svg>
            {t('vs_last_week')}
          </div>
        </div>
      </div>
      <div className="chart-body">
        <div className="chart-svg-wrap">
          <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8973f" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#c8973f" stopOpacity="0" />
              </linearGradient>
            </defs>
            {grid}
            <path d={areaPath} fill="url(#rg)" />
            <path d={linePath} fill="none" stroke="#c8973f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="5" fill="#111009" stroke="#c8973f" strokeWidth="2.5" />
                <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="2" fill="#c8973f" />
              </g>
            ))}
            {chartData.map((d, i) => (
              <text
                key={i}
                x={pts[i]?.x.toFixed(1)}
                y={H - 6}
                textAnchor="middle"
                fill="#6b6255"
                fontSize="10"
                fontFamily="DM Sans,sans-serif"
              >
                {d.day_name}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
