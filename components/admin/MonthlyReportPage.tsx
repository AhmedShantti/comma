'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { useAuth } from '../AuthProvider';
import type { MonthlyReport } from '@/lib/types';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function MonthlyReportPage() {
  const { t } = useLang();
  const { logout } = useAuth();
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await api.reports.monthlyLatest();
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
      await api.reports.generateMonthly();
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

  const renderWeeklyChart = (data: MonthlyReport['weekly_breakdown']) => {
    if (!data || data.length === 0) return null;
    const maxV = Math.max(...data.map(d => d.revenue), 1);
    const barW = Math.min(60, (cW / data.length) - 8);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8973f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c8973f" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((pct, i) => {
          const y = pad.top + cH - pct * cH;
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#2a2218" strokeWidth="1" />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fill="#6b6255" fontSize="9" fontFamily="DM Sans,sans-serif">
                {((maxV * pct) / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const barH = (d.revenue / maxV) * cH;
          const x = pad.left + (i * (cW / data.length)) + ((cW / data.length) - barW) / 2;
          const y = pad.top + cH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill="url(#mg)" rx="3" />
              <text x={x + barW / 2} y={H - 6} textAnchor="middle" fill="#6b6255" fontSize="10" fontFamily="DM Sans,sans-serif">
                W{d.week_number}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderPaymentBars = (data: Record<string, number>) => {
    const entries = Object.entries(data);
    if (entries.length === 0) return null;
    const total = entries.reduce((s, [, v]) => s + Number(v), 0);
    const colors = ['#c8973f', '#4a90e2', '#50c878', '#e8a87c', '#9b59b6'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {entries.map(([method, amount], i) => {
          const pct = total > 0 ? (Number(amount) / total) * 100 : 0;
          return (
            <div key={method}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text)', textTransform: 'capitalize' }}>{method}</span>
                <span style={{ color: 'var(--text-muted)' }}>{t('egp')} {fmtNum(Number(amount))} ({pct.toFixed(0)}%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: colors[i % colors.length], borderRadius: '3px', transition: 'width 0.5s' }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/reports" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>← {t('reports')}</Link>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>{t('monthly_reports')}</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleGenerate} disabled={generating} style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            {generating ? t('generating') : t('generate_report')}
          </button>
          {report && (
            <a href={api.reports.monthlyPdf(report.id)} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '6px 16px', fontSize: '0.8rem', textDecoration: 'none' }}>
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
            {MONTH_NAMES[report.month]} {report.year} &middot; {report.month_start_date} — {report.month_end_date}
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
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div></div>
              <div><div className="stat-value">{Number(report.profit_margin_percentage).toFixed(1)}%</div><div className="stat-label">{t('profit_margin')}</div></div>
            </div>
          </div>

          {/* Busiest / Slowest Days + Customer Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
            {report.busiest_day && (
              <div className="stat-card" style={{ borderLeft: '3px solid #4caf50' }}>
                <div><div className="stat-value">{report.busiest_day}</div><div className="stat-label">{t('busiest_day')}</div></div>
              </div>
            )}
            {report.slowest_day && (
              <div className="stat-card" style={{ borderLeft: '3px solid #f44336' }}>
                <div><div className="stat-value">{report.slowest_day}</div><div className="stat-label">{t('slowest_day')}</div></div>
              </div>
            )}
            {report.customer_stats && (
              <div className="stat-card" style={{ borderLeft: '3px solid var(--gold)' }}>
                <div>
                  <div className="stat-value">{report.customer_stats.total_unique}</div>
                  <div className="stat-label">{t('new_customers')}: {report.customer_stats.new_customers} / {t('returning_customers')}: {report.customer_stats.returning_customers}</div>
                </div>
              </div>
            )}
          </div>

          {/* Charts Row */}
          <div className="charts-row" style={{ marginTop: '16px' }}>
            {/* Weekly Breakdown Chart */}
            <div className="section-card">
              <div className="section-head">
                <div>
                  <div className="section-title">{t('weekly_breakdown')}</div>
                  <div className="section-sub">{t('revenue')} ({t('egp')})</div>
                </div>
              </div>
              <div className="chart-body">
                <div className="chart-svg-wrap">
                  {renderWeeklyChart(report.weekly_breakdown)}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="section-card">
              <div className="section-head">
                <div><div className="section-title">{t('payment_methods')}</div></div>
              </div>
              <div className="chart-body" style={{ padding: '16px 20px' }}>
                {renderPaymentBars(report.payment_methods_breakdown)}
              </div>
            </div>
          </div>

          {/* Top & Worst Products */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div className="section-card">
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

            <div className="section-card">
              <div className="section-head"><div><div className="section-title">{t('worst_products')}</div></div></div>
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
                    {(report.worst_selling_products || []).map((p, i) => (
                      <tr key={p.productId || i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ padding: '10px 16px', color: 'var(--text)' }}>{p.name}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text)' }}>{p.quantity}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f44336' }}>{t('egp')} {fmtNum(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Weekly Breakdown Table */}
          <div className="section-card" style={{ marginTop: '16px' }}>
            <div className="section-head"><div><div className="section-title">{t('weekly_breakdown')}</div></div></div>
            <div className="chart-body" style={{ padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>{t('week_label')}</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>{t('total_orders')}</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>{t('revenue')}</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>{t('profit')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(report.weekly_breakdown || []).map((w, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 16px', color: 'var(--text)' }}>W{w.week_number}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text)' }}>{w.orders}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--text)' }}>{t('egp')} {fmtNum(w.revenue)}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: 'var(--gold)' }}>{t('egp')} {fmtNum(w.profit)}</td>
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
