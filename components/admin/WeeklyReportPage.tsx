'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { useAuth } from '../AuthProvider';
import type { WeeklyReport } from '@/lib/types';

export function WeeklyReportPage() {
  const { t } = useLang();
  const { logout } = useAuth();
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await api.reports.weeklyLatest();
      setReport(data);
    } catch (err: any) {
      if (err?.message?.includes('401')) { await logout(); return; }
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await api.reports.generateWeekly();
      await fetchReport();
    } catch {} finally {
      setGenerating(false);
    }
  };

  const fmtNum = (n: number) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (n: number) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${Number(n).toFixed(1)}%`;

  const W = 520, H = 180;
  const pad = { top: 16, right: 16, bottom: 32, left: 56 };
  const cW = W - pad.left - pad.right, cH = H - pad.top - pad.bottom;

  const renderDailyChart = (data: WeeklyReport['daily_breakdown']) => {
    if (!data || data.length === 0) return null;
    const vals = data.map(d => d.revenue);
    const maxV = Math.max(...vals, 1);
    const minV = Math.min(...vals, 0);
    const range = maxV - minV || 1;

    const pts = vals.map((v, i) => ({
      x: pad.left + (i / Math.max(vals.length - 1, 1)) * cW,
      y: pad.top + cH - ((v - minV) / range) * cH,
    }));

    const linePath = pts.map((p, i) => {
      if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      const prev = pts[i - 1];
      const mx = (prev.x + p.x) / 2;
      return `C${mx.toFixed(1)},${prev.y.toFixed(1)} ${mx.toFixed(1)},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');

    const last = pts[pts.length - 1];
    const areaPath = linePath + ` L${last.x.toFixed(1)},${(H - pad.bottom).toFixed(1)} L${pad.left.toFixed(1)},${(H - pad.bottom).toFixed(1)} Z`;

    const grid = [0, 0.33, 0.66, 1].map((pct, i) => {
      const y = pad.top + cH - pct * cH;
      const v = ((minV + range * pct) / 1000).toFixed(0);
      return (
        <g key={i}>
          <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#2a2218" strokeWidth="1" />
          <text x={pad.left - 8} y={y + 4} textAnchor="end" fill="#6b6255" fontSize="10" fontFamily="DM Sans,sans-serif">{v}k</text>
        </g>
      );
    });

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="wrg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8973f" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c8973f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {grid}
        <path d={areaPath} fill="url(#wrg)" />
        <path d={linePath} fill="none" stroke="#c8973f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="5" fill="#111009" stroke="#c8973f" strokeWidth="2.5" />
            <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="2" fill="#c8973f" />
          </g>
        ))}
        {data.map((d, i) => (
          <text key={i} x={pts[i]?.x.toFixed(1)} y={H - 6} textAnchor="middle" fill="#6b6255" fontSize="10" fontFamily="DM Sans,sans-serif">
            {d.date.slice(5)}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/reports" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>← {t('reports')}</Link>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>{t('weekly_reports')}</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleGenerate} disabled={generating} style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            {generating ? t('generating') : t('generate_report')}
          </button>
          {report && (
            <a href={api.reports.weeklyPdf(report.id)} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '6px 16px', fontSize: '0.8rem', textDecoration: 'none' }}>
              {t('download_pdf')}
            </a>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : !report ? (
        <div className="section-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>{t('no_reports')}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>{t('generate_first')}</p>
        </div>
      ) : (
        <>
          {/* Period Label */}
          <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            W{report.week_number} {report.year} &middot; {report.week_start_date} — {report.week_end_date}
          </div>

          {/* KPI Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <span className={`stat-change ${report.revenue_growth_percentage >= 0 ? 'up' : 'down'}`}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d={report.revenue_growth_percentage >= 0 ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
                  </svg>
                  {fmtPct(report.revenue_growth_percentage)}
                </span>
              </div>
              <div><div className="stat-value">{t('egp')} {fmtInt(report.total_revenue)}</div><div className="stat-label">{t('total_revenue')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                </div>
                <span className={`stat-change ${report.order_growth_percentage >= 0 ? 'up' : 'down'}`}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d={report.order_growth_percentage >= 0 ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
                  </svg>
                  {fmtPct(report.order_growth_percentage)}
                </span>
              </div>
              <div><div className="stat-value">{report.total_orders}</div><div className="stat-label">{t('total_orders')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-top"><div className="stat-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div></div>
              <div><div className="stat-value">{t('egp')} {fmtInt(report.net_profit)}</div><div className="stat-label">{t('net_profit')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-top"><div className="stat-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div></div>
              <div><div className="stat-value">{t('egp')} {fmtInt(report.average_order_value)}</div><div className="stat-label">{t('avg_order_value')}</div></div>
            </div>
          </div>

          {/* Busiest Day */}
          {report.busiest_day && (
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <span style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{t('busiest_day')}: <strong style={{ color: 'var(--gold)' }}>{report.busiest_day}</strong></span>
            </div>
          )}

          {/* Revenue Chart */}
          <div className="section-card" style={{ marginTop: '16px' }}>
            <div className="section-head">
              <div>
                <div className="section-title">{t('daily_breakdown')}</div>
                <div className="section-sub">{t('revenue')} ({t('egp')})</div>
              </div>
              <div className="section-meta">
                <div className="meta-value">{t('egp')} {fmtInt(report.total_revenue)}</div>
              </div>
            </div>
            <div className="chart-body">
              <div className="chart-svg-wrap">
                {renderDailyChart(report.daily_breakdown)}
              </div>
            </div>
          </div>

          {/* Daily Breakdown Table */}
          <div className="section-card" style={{ marginTop: '16px' }}>
            <div className="section-head">
              <div><div className="section-title">{t('daily_breakdown')}</div></div>
            </div>
            <div className="chart-body" style={{ padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>{t('date_label')}</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>{t('total_orders')}</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>{t('revenue')}</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>{t('profit')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(report.daily_breakdown || []).map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 16px', color: 'var(--text)' }}>{d.date}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text)' }}>{d.orders}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text)' }}>{t('egp')} {fmtNum(d.revenue)}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gold)' }}>{t('egp')} {fmtNum(d.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="section-card" style={{ marginTop: '16px' }}>
            <div className="section-head"><div><div className="section-title">{t('top_products')}</div></div></div>
            <div className="chart-body" style={{ padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>#</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>{t('product_name')}</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>{t('quantity')}</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>{t('revenue')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(report.top_selling_products || []).map((p, i) => (
                    <tr key={p.productId || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--text)' }}>{p.name}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text)' }}>{p.quantity}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gold)' }}>{t('egp')} {fmtNum(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
