'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { useAuth } from '../AuthProvider';
import type { DailyReport } from '@/lib/types';

export function DailyReportPage() {
  const { t } = useLang();
  const { logout } = useAuth();
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dateInput, setDateInput] = useState('');

  const fetchReport = async (date?: string) => {
    try {
      setLoading(true);
      const data = await (date ? api.reports.daily(date) : api.reports.dailyLatest());
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
      await api.reports.generateDaily(dateInput || undefined);
      await fetchReport(dateInput || undefined);
    } catch {} finally {
      setGenerating(false);
    }
  };

  const fmtNum = (n: number) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (n: number) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  // SVG chart dimensions
  const W = 520, H = 160;
  const pad = { top: 16, right: 16, bottom: 28, left: 48 };
  const cW = W - pad.left - pad.right, cH = H - pad.top - pad.bottom;

  const renderHourlyChart = (data: DailyReport['hourly_distribution']) => {
    if (!data || data.length === 0) return null;
    const maxV = Math.max(...data.map(d => d.revenue), 1);
    const barW = cW / 24 - 2;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
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
                {fmtInt(maxV * pct)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const barH = (d.revenue / maxV) * cH;
          const x = pad.left + i * (cW / 24) + 1;
          const y = pad.top + cH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill="url(#hg)" rx="1" />
              {i % 3 === 0 && (
                <text x={x + barW / 2} y={H - 6} textAnchor="middle" fill="#6b6255" fontSize="8" fontFamily="DM Sans,sans-serif">
                  {d.hour}:00
                </text>
              )}
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
          <Link href="/dashboard/reports" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
            ← {t('reports')}
          </Link>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>{t('daily_reports')}</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="date"
            value={dateInput}
            onChange={e => { setDateInput(e.target.value); if (e.target.value) fetchReport(e.target.value); }}
            className="search-input"
            style={{ padding: '6px 10px', fontSize: '0.8rem', width: '160px' }}
          />
          <button className="btn-primary" onClick={handleGenerate} disabled={generating} style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
            {generating ? t('generating') : t('generate_report')}
          </button>
          {report && (
            <a
              href={api.reports.dailyPdf(report.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ padding: '6px 16px', fontSize: '0.8rem', textDecoration: 'none' }}
            >
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
          {/* KPI Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div><div className="stat-value">{t('egp')} {fmtInt(report.total_revenue)}</div><div className="stat-label">{t('total_revenue')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
              </div>
              <div><div className="stat-value">{report.total_orders}</div><div className="stat-label">{t('total_orders')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div><div className="stat-value">{t('egp')} {fmtInt(report.net_profit)}</div><div className="stat-label">{t('net_profit')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <div><div className="stat-value">{t('egp')} {fmtInt(report.average_order_value)}</div><div className="stat-label">{t('avg_order_value')}</div></div>
            </div>
          </div>

          {/* Order Stats Row */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '16px' }}>
            <div className="stat-card" style={{ borderLeft: '3px solid #4caf50' }}>
              <div><div className="stat-value">{report.completed_orders}</div><div className="stat-label">{t('completed_orders')}</div></div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid #f44336' }}>
              <div><div className="stat-value">{report.cancelled_orders}</div><div className="stat-label">{t('cancelled_orders')}</div></div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid #ff9800' }}>
              <div><div className="stat-value">{report.pending_orders}</div><div className="stat-label">{t('pending')}</div></div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row" style={{ marginTop: '16px' }}>
            {/* Hourly Distribution */}
            <div className="section-card">
              <div className="section-head">
                <div>
                  <div className="section-title">{t('hourly_dist')}</div>
                  <div className="section-sub">{t('revenue')} ({t('egp')})</div>
                </div>
              </div>
              <div className="chart-body">
                <div className="chart-svg-wrap">
                  {renderHourlyChart(report.hourly_distribution)}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="section-card">
              <div className="section-head">
                <div>
                  <div className="section-title">{t('payment_methods')}</div>
                </div>
              </div>
              <div className="chart-body" style={{ padding: '16px 20px' }}>
                {renderPaymentBars(report.payment_methods_breakdown)}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="section-card" style={{ marginTop: '16px' }}>
            <div className="section-head">
              <div>
                <div className="section-title">{t('top_products')}</div>
              </div>
            </div>
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
