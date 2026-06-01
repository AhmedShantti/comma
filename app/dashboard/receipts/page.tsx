'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useLang } from '@/components/LangProvider';
import { printReceipt } from './ReceiptPrinter';
import type { Receipt, ReceiptStats } from '@/lib/types';

const card = { background: '#1a1918', border: '1px solid rgba(201,168,76,0.08)', borderRadius: '8px', padding: '20px' };
const gold = '#c9a84c';

export default function ReceiptsPage() {
  const { t } = useLang();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState<ReceiptStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [filters, setFilters] = useState({ receipt_number: '', table_number: '', payment_method: '', start_date: '', end_date: '' });

  const fetchReceipts = useCallback(async () => {
    try {
      setLoading(true);
      const cleanFilters: any = { page: meta.page, limit: meta.limit };
      Object.entries(filters).forEach(([k, v]) => { if (v) cleanFilters[k] = v; });
      const res = await api.receipts.getAll(cleanFilters);
      setReceipts(res?.data || []);
      if (res?.meta) setMeta(res.meta);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [meta.page, meta.limit, filters]);

  const fetchStats = async () => {
    try {
      const s = await api.receipts.getStats();
      setStats(s);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchReceipts(); }, [fetchReceipts]);
  useEffect(() => { fetchStats(); }, []);

  const handleSearch = () => { setMeta(m => ({ ...m, page: 1 })); fetchReceipts(); };
  const handleView = async (id: string) => {
    try {
      const r = await api.receipts.getById(id);
      setSelectedReceipt(r);
    } catch { /* silent */ }
  };

  const fmtCurrency = (v: number) => `EGP ${Number(v || 0).toFixed(2)}`;
  const fmtDate = (d: string) => {
    try { return new (globalThis.Date as any)(d).toLocaleDateString('en-EG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return d; }
  };

  return (
    <div style={{ padding: '24px', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Receipts</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Receipts Today', value: stats?.receiptsToday ?? '-' },
          { label: 'Revenue Today', value: stats ? fmtCurrency(stats.revenueToday) : '-' },
          { label: 'Revenue This Month', value: stats ? fmtCurrency(stats.revenueThisMonth) : '-' },
          { label: 'Avg Receipt', value: stats ? fmtCurrency(stats.averageReceiptValue) : '-' },
        ].map((s, i) => (
          <div key={i} style={card}>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 600, color: gold }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...card, marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>Receipt #</label>
          <input value={filters.receipt_number} onChange={e => setFilters(f => ({ ...f, receipt_number: e.target.value }))} placeholder="Search..." style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>Table</label>
          <input value={filters.table_number} onChange={e => setFilters(f => ({ ...f, table_number: e.target.value }))} placeholder="Table #" type="number" style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>Payment</label>
          <select value={filters.payment_method} onChange={e => setFilters(f => ({ ...f, payment_method: e.target.value }))} style={inputStyle}>
            <option value="">All</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>From</label>
          <input type="date" value={filters.start_date} onChange={e => setFilters(f => ({ ...f, start_date: e.target.value }))} style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 140px' }}>
          <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>To</label>
          <input type="date" value={filters.end_date} onChange={e => setFilters(f => ({ ...f, end_date: e.target.value }))} style={inputStyle} />
        </div>
        <button onClick={handleSearch} style={{ padding: '10px 20px', background: gold, color: '#0f0e0d', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', height: '40px' }}>
          Search
        </button>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading receipts...</div>
        ) : receipts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No receipts found</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                {['Receipt #', 'Table', 'Order', 'Items', 'Total', 'Payment', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {receipts.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', color: gold, fontWeight: 600, fontSize: '14px' }}>{r.receipt_number}</td>
                  <td style={tdStyle}>{r.table_number || '-'}</td>
                  <td style={tdStyle}>{r.order_number}</td>
                  <td style={tdStyle}>{r.items?.length || 0}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{fmtCurrency(r.total)}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 500, background: r.payment_method === 'cash' ? 'rgba(76,175,80,0.15)' : r.payment_method === 'card' ? 'rgba(33,150,243,0.15)' : 'rgba(201,168,76,0.15)', color: r.payment_method === 'cash' ? '#4CAF50' : r.payment_method === 'card' ? '#2196F3' : gold }}>
                      {(r.payment_method || 'cash').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: '13px', color: '#999' }}>{fmtDate(r.created_at)}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleView(r.id)} style={btnStyle}>View</button>
                      <button onClick={() => printReceipt(r)} style={{ ...btnStyle, background: 'rgba(76,175,80,0.15)', color: '#4CAF50' }}>Print</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button disabled={meta.page <= 1} onClick={() => setMeta(m => ({ ...m, page: m.page - 1 }))} style={{ ...btnStyle, opacity: meta.page <= 1 ? 0.4 : 1 }}>Prev</button>
            <span style={{ color: '#999', lineHeight: '32px', fontSize: '13px' }}>Page {meta.page} of {meta.totalPages}</span>
            <button disabled={meta.page >= meta.totalPages} onClick={() => setMeta(m => ({ ...m, page: m.page + 1 }))} style={{ ...btnStyle, opacity: meta.page >= meta.totalPages ? 0.4 : 1 }}>Next</button>
          </div>
        )}
      </div>

      {/* Receipt Detail Modal */}
      {selectedReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedReceipt(null)}>
          <div style={{ background: '#1a1918', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '85vh', overflow: 'auto', border: '1px solid rgba(201,168,76,0.15)' }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{selectedReceipt.receipt_number}</h2>
                  <p style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>{fmtDate(selectedReceipt.created_at)}</p>
                </div>
                <button onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', color: '#999', fontSize: '20px', cursor: 'pointer' }}>×</button>
              </div>
              {selectedReceipt.business_name && <p style={{ fontSize: '13px', color: gold, marginTop: '8px' }}>{selectedReceipt.business_name}</p>}
            </div>

            {/* Order Info */}
            <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {selectedReceipt.order_number && <div><span style={{ color: '#999' }}>Order:</span> {selectedReceipt.order_number}</div>}
              {selectedReceipt.table_number && <div><span style={{ color: '#999' }}>Table:</span> {selectedReceipt.table_number}</div>}
              {selectedReceipt.cashier_name && <div><span style={{ color: '#999' }}>Cashier:</span> {selectedReceipt.cashier_name}</div>}
              {selectedReceipt.waiter_name && <div><span style={{ color: '#999' }}>Waiter:</span> {selectedReceipt.waiter_name}</div>}
            </div>

            {/* Items */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Items</h3>
              {(selectedReceipt.items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', borderBottom: i < selectedReceipt.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <div>
                    <span>{item.item_name_en}</span>
                    <span style={{ color: '#999', marginLeft: '8px' }}>x{item.quantity}</span>
                    {item.notes && <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{item.notes}</div>}
                  </div>
                  <span style={{ fontWeight: 500 }}>{fmtCurrency(item.line_total)}</span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div style={{ padding: '16px 24px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Subtotal</span><span>{fmtCurrency(selectedReceipt.subtotal)}</span></div>
              {Number(selectedReceipt.discount_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Discount</span><span style={{ color: '#F44336' }}>-{fmtCurrency(selectedReceipt.discount_amount)}</span></div>}
              {Number(selectedReceipt.tax_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Tax ({selectedReceipt.tax_rate}%)</span><span>{fmtCurrency(selectedReceipt.tax_amount)}</span></div>}
              {Number(selectedReceipt.service_charge_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Service Charge ({selectedReceipt.service_charge_rate}%)</span><span>{fmtCurrency(selectedReceipt.service_charge_amount)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(201,168,76,0.15)', fontSize: '16px', fontWeight: 700 }}>
                <span>Total</span><span style={{ color: gold }}>{fmtCurrency(selectedReceipt.total)}</span>
              </div>
            </div>

            {/* Payment & Footer */}
            <div style={{ padding: '16px 24px' }}>
              <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: '#999' }}>Payment: </span>
                <span style={{ textTransform: 'uppercase', fontWeight: 500 }}>{selectedReceipt.payment_method || 'cash'}</span>
              </div>
              {selectedReceipt.footer_message && <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '8px' }}>{selectedReceipt.footer_message}</p>}
              <button onClick={() => printReceipt(selectedReceipt)} style={{ marginTop: '16px', width: '100%', padding: '12px', background: gold, color: '#0f0e0d', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', background: '#0f0e0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none',
};

const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '14px', color: '#ccc' };

const btnStyle: React.CSSProperties = {
  padding: '6px 12px', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
};
