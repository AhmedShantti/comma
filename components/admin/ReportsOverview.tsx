'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { useAuth } from '../AuthProvider';
import type { DashboardSummary } from '@/lib/types';

export function ReportsOverview() {
  const { t } = useLang();
  const { logout } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await api.reports.dashboardSummary();
      setSummary(data);
    } catch (err: any) {
      if (err?.message?.includes('401')) { await logout(); return; }
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const handleGenerateAll = async () => {
    try {
      setGenerating(true);
      await api.reports.generateBulk();
      await fetchSummary();
    } catch {
    } finally {
      setGenerating(false);
    }
  };

  const fmtNum = (n: number) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${Number(n).toFixed(1)}%`;

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  const hasData = summary && (summary.daily || summary.weekly || summary.monthly);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text)', margin: 0 }}>{t('reports_overview')}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {t('generate_first')}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={handleGenerateAll}
          disabled={generating}
          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
        >
          {generating ? t('generating') : t('generate_report')}
        </button>
      </div>

      {!hasData ? (
        <div className="section-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <svg width="48" height="48" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: '16px', opacity: 0.5 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('no_reports')}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>{t('generate_first')}</p>
        </div>
      ) : (
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {/* Daily Summary Card */}
          <Link href="/dashboard/reports/daily" style={{ textDecoration: 'none' }}>
            <div className="section-card" style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold)' }}>{t('daily_reports')}</span>
                <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              {summary?.daily ? (
                <>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{summary.daily.date}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('total_revenue')}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{t('egp')} {fmtNum(summary.daily.total_revenue)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('total_orders')}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{summary.daily.total_orders}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('net_profit')}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{t('egp')} {fmtNum(summary.daily.net_profit)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('avg_order_value')}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{t('egp')} {fmtNum(summary.daily.average_order_value)}</div>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('no_reports')}</p>
              )}
            </div>
          </Link>

          {/* Weekly Summary Card */}
          <Link href="/dashboard/reports/weekly" style={{ textDecoration: 'none' }}>
            <div className="section-card" style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold)' }}>{t('weekly_reports')}</span>
                <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              {summary?.weekly ? (
                <>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>W{summary.weekly.week} {summary.weekly.year}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('total_revenue')}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{t('egp')} {fmtNum(summary.weekly.total_revenue)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('total_orders')}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{summary.weekly.total_orders}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('growth')}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: summary.weekly.revenue_growth_percentage >= 0 ? '#4caf50' : '#f44336' }}>
                        {fmtPct(summary.weekly.revenue_growth_percentage)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('net_profit')}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{t('egp')} {fmtNum(summary.weekly.net_profit)}</div>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('no_reports')}</p>
              )}
            </div>
          </Link>

          {/* Monthly Summary Card */}
          <Link href="/dashboard/reports/monthly" style={{ textDecoration: 'none' }}>
            <div className="section-card" style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold)' }}>{t('monthly_reports')}</span>
                <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              {summary?.monthly ? (
                <>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][summary.monthly.month]} {summary.monthly.year}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('total_revenue')}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{t('egp')} {fmtNum(summary.monthly.total_revenue)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('profit_margin')}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{Number(summary.monthly.profit_margin_percentage).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('growth')}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: summary.monthly.revenue_growth_percentage >= 0 ? '#4caf50' : '#f44336' }}>
                        {fmtPct(summary.monthly.revenue_growth_percentage)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('net_profit')}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{t('egp')} {fmtNum(summary.monthly.net_profit)}</div>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('no_reports')}</p>
              )}
            </div>
          </Link>
        </div>
      )}
    </>
  );
}
