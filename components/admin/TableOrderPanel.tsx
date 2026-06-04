'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';

type MenuItem = { id: string; name: { en: string; ar: string }; price: number; cat?: string };
type Category = { id: string; slug: string; name: { en: string; ar: string } };
type OrderItem = {
  id: string; menu_item_id: string; item_name_en: string; item_name_ar: string;
  unit_price: number; quantity: number; subtotal: number; notes?: string;
  is_voided: boolean; addons?: any[];
};

type Props = {
  order: any;
  tableId: string;
  onClose: () => void;
  onOrderUpdate: (order: any) => void;
};

export function TableOrderPanel({ order, tableId, onClose, onOrderUpdate }: Props) {
  const { lang } = useLang();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [payMethod, setPayMethod] = useState('cash');
  const [payAmount, setPayAmount] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const [catsRes, itemsRes] = await Promise.all([
          api.categories.getAll('limit=100'),
          api.menuItems.getAll('limit=100&is_active=true'),
        ]);
        const catsData = Array.isArray(catsRes) ? catsRes : (catsRes?.data ?? []);
        const itemsData = Array.isArray(itemsRes) ? itemsRes : (itemsRes?.data ?? []);
        setCategories(catsData.map((c: any) => ({ id: c.id, slug: c.id, name: { en: c.name_en ?? '', ar: c.name_ar ?? '' } })));
        setMenuItems(itemsData.map((m: any) => ({ id: m.id, name: { en: m.name_en ?? '', ar: m.name_ar ?? '' }, price: Number(m.base_price ?? 0), cat: m.category_id })));
      } catch { /* silent */ }
    })();
  }, []);

  const activeItems: OrderItem[] = (order?.items || []).filter((i: any) => !i.is_voided);

  const filteredMenu = useMemo(() =>
    activeCat === 'all' ? menuItems : menuItems.filter(m => m.cat === activeCat),
    [menuItems, activeCat]
  );

  const refreshOrder = async () => {
    try {
      const updated = await api.orders.getById(order.id);
      onOrderUpdate(updated);
    } catch { /* silent */ }
  };

  const addItem = async (menuItemId: string) => {
    try {
      setLoading(true);
      setError('');
      await api.orders.addItems(order.id, [{ menu_item_id: menuItemId, quantity: 1 }]);
      await refreshOrder();
      setSuccess('Item added');
      setTimeout(() => setSuccess(''), 2000);
    } catch (e: any) {
      setError(e.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      setError('');
      await api.orders.removeItem(order.id, itemId);
      await refreshOrder();
    } catch (e: any) {
      setError(e.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    try {
      setLoading(true);
      await api.orders.updateItem(order.id, itemId, { quantity: qty });
      await refreshOrder();
    } catch (e: any) {
      setError(e.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const amount = parseFloat(payAmount) || order.total;
    if (amount < Number(order.total)) {
      setError('Payment amount must be >= order total');
      return;
    }
    try {
      setCheckingOut(true);
      setError('');
      const result = await api.orders.checkout(order.id, {
        payments: [{ method: payMethod, amount }],
      });
      if (result?.receipt) {
        setReceipt(result.receipt);
        setShowCheckout(false);
      } else {
        setSuccess('Payment processed!');
        setTimeout(() => { onClose(); }, 1500);
      }
    } catch (e: any) {
      setError(e.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 800, maxHeight: '90vh', overflow: 'auto' }}>
        {/* Header */}
        <div className="modal-head">
          <div>
            <div className="section-title">
              Table {order.table_number} — Order {order.order_number}
            </div>
            <div className="section-sub">
              Status: <span style={{ color: '#c9a84c', fontWeight: 600 }}>{order.status?.toUpperCase()}</span>
              {' · '}Items: {activeItems.length}
              {' · '}Total: EGP {Number(order.total || 0).toFixed(2)}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {error && <div style={{ padding: 10, marginBottom: 12, borderRadius: 6, background: '#ff6b6b22', border: '1px solid #ff6b6b', color: '#ff6b6b', fontSize: '0.85rem' }}>{error}</div>}
          {success && <div style={{ padding: 10, marginBottom: 12, borderRadius: 6, background: '#4caf5022', border: '1px solid #4caf50', color: '#4caf50', fontSize: '0.85rem' }}>{success}</div>}

          {/* Current Order Items */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-soft)' }}>Current Items</h3>
            {activeItems.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '16px 0' }}>No items yet. Add items from the menu below.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeItems.map((item: OrderItem) => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                  }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                        {lang === 'ar' ? item.item_name_ar : item.item_name_en}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 8 }}>
                        EGP {Number(item.unit_price).toFixed(2)}
                      </span>
                      {item.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.notes}</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                        onClick={() => updateQty(item.id, item.quantity - 1)} disabled={loading || item.quantity <= 1}>−</button>
                      <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                        onClick={() => updateQty(item.id, item.quantity + 1)} disabled={loading}>+</button>
                      <span style={{ minWidth: 70, textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>
                        EGP {(Number(item.unit_price) * item.quantity).toFixed(2)}
                      </span>
                      <button className="btn-ghost" style={{ padding: '4px 6px', color: '#d45454', fontSize: '0.8rem' }}
                        onClick={() => removeItem(item.id)} disabled={loading}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Totals */}
          {activeItems.length > 0 && (
            <div style={{ padding: '12px 14px', borderRadius: 6, backgroundColor: 'var(--bg)', marginBottom: 20, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>EGP {Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Discount</span>
                  <span style={{ color: '#ff6b6b' }}>-EGP {Number(order.discount_amount).toFixed(2)}</span>
                </div>
              )}
              {Number(order.tax_amount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tax ({order.tax_rate}%)</span>
                  <span>EGP {Number(order.tax_amount).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontWeight: 700, fontSize: '1rem' }}>
                <span>Total</span>
                <span style={{ color: '#c9a84c' }}>EGP {Number(order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Add Items from Menu */}
          {order.status === 'open' && (
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-soft)' }}>Add Items</h3>

              {/* Category Tabs */}
              <div style={{ marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className={`cat-tab${activeCat === 'all' ? ' active' : ''}`} onClick={() => setActiveCat('all')}>All</button>
                {categories.map(c => (
                  <button key={c.id} className={`cat-tab${activeCat === c.slug ? ' active' : ''}`} onClick={() => setActiveCat(c.slug)}>
                    {c.name[lang]}
                  </button>
                ))}
              </div>

              {/* Menu Items Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, maxHeight: 250, overflow: 'auto', padding: '4px 0' }}>
                {filteredMenu.map(item => (
                  <button
                    key={item.id}
                    onClick={() => addItem(item.id)}
                    disabled={loading}
                    style={{
                      padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)',
                      background: 'var(--bg)', cursor: 'pointer', textAlign: 'left',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#c9a84c')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.name[lang]}</span>
                    <span style={{ fontSize: '0.8rem', color: '#c9a84c', fontWeight: 600 }}>EGP {item.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-foot">
          <div className="modal-actions" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-ghost" onClick={onClose}>Close</button>
            {activeItems.length > 0 && order.status === 'open' && (
              <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.95rem' }}
                onClick={() => setShowCheckout(true)}>
                💳 Checkout — EGP {Number(order.total || 0).toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1001,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} onClick={() => setShowCheckout(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: 'var(--bg-elevated)', borderRadius: 10, padding: 28,
              maxWidth: 420, width: '90%', border: '1px solid var(--border)',
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20 }}>
                Checkout — Table {order.table_number}
              </h2>

              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Order Total</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c9a84c' }}>
                  EGP {Number(order.total || 0).toFixed(2)}
                </p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="login-label">Payment Method</label>
                <select className="search-input modal-select" value={payMethod} onChange={e => setPayMethod(e.target.value)} style={{ padding: '10px 14px' }}>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="login-label">Amount Received</label>
                <input className="search-input" type="number" step="0.01"
                  value={payAmount} onChange={e => setPayAmount(e.target.value)}
                  placeholder={String(Number(order.total || 0).toFixed(2))}
                  style={{ padding: '10px 14px' }} />
                {payAmount && parseFloat(payAmount) > Number(order.total) && (
                  <p style={{ fontSize: '0.8rem', color: '#4caf50', marginTop: 4 }}>
                    Change: EGP {(parseFloat(payAmount) - Number(order.total)).toFixed(2)}
                  </p>
                )}
              </div>

              {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowCheckout(false)} disabled={checkingOut}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1, padding: '12px 0', fontSize: '0.95rem' }}
                  onClick={handleCheckout} disabled={checkingOut}>
                  {checkingOut ? 'Processing…' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Display Modal */}
        {receipt && (
          <ReceiptModal receipt={receipt} onClose={() => { setReceipt(null); onClose(); }} />
        )}
      </div>
    </div>
  );
}

type ReceiptModalProps = { receipt: any; onClose: () => void };

function exportReceiptPDF(receipt: any) {
  try {
    const itemsHtml = (receipt.items || []).map((item: any) =>
      `<tr><td>${item.item_name_en}</td><td style="text-align:center">${item.quantity}</td><td style="text-align:right">${Number(item.unit_price).toFixed(2)}</td><td style="text-align:right">${Number(item.line_total).toFixed(2)}</td></tr>`
    ).join('');

    const html = `<html><head><style>
      body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; width: 72mm; }
      .center { text-align: center; } .right { text-align: right; } .bold { font-weight: bold; }
      .separator { border-top: 1px dashed #000; margin: 4px 0; }
      .business-name { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; } td { padding: 2px 0; }
    </style></head><body>
      <div class="business-name">${receipt.business_name || 'COMMA'}</div>
      ${receipt.business_address ? `<div class="center">${receipt.business_address}</div>` : ''}
      ${receipt.business_phone ? `<div class="center">Tel: ${receipt.business_phone}</div>` : ''}
      <div class="separator"></div>
      <div>Receipt: ${receipt.receipt_number}</div>
      ${receipt.order_number ? `<div>Order: ${receipt.order_number}</div>` : ''}
      ${receipt.table_number ? `<div>Table: ${receipt.table_number}</div>` : ''}
      <div>Date: ${new Date(receipt.created_at).toLocaleString()}</div>
      <div class="separator"></div>
      <table><tr class="bold"><td>Item</td><td style="text-align:center">Qty</td><td style="text-align:right">Price</td><td style="text-align:right">Total</td></tr>${itemsHtml}</table>
      <div class="separator"></div>
      <table>
        <tr><td>Subtotal</td><td class="right">${Number(receipt.subtotal).toFixed(2)}</td></tr>
        ${Number(receipt.discount_amount) > 0 ? `<tr><td>Discount</td><td class="right">-${Number(receipt.discount_amount).toFixed(2)}</td></tr>` : ''}
        ${Number(receipt.tax_amount) > 0 ? `<tr><td>Tax (${receipt.tax_rate}%)</td><td class="right">${Number(receipt.tax_amount).toFixed(2)}</td></tr>` : ''}
        <tr style="font-weight: bold;"><td>TOTAL</td><td class="right">EGP ${Number(receipt.total).toFixed(2)}</td></tr>
      </table>
      <div class="separator"></div>
      <div>Payment: ${(receipt.payment_method || 'cash').toUpperCase()}</div>
      <div class="center" style="margin-top:8px">Thank you!</div>
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receipt.receipt_number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Export failed:', e);
  }
}

function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const printReceipt = () => {
    const itemsHtml = (receipt.items || []).map((item: any) =>
      `<tr><td>${item.item_name_en}</td><td style="text-align:center">${item.quantity}</td><td style="text-align:right">${Number(item.unit_price).toFixed(2)}</td><td style="text-align:right">${Number(item.line_total).toFixed(2)}</td></tr>`
    ).join('');

    const html = `<!DOCTYPE html><html><head><title>Receipt ${receipt.receipt_number}</title><style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Courier New', monospace; font-size: 12px; width: 72mm; margin: 0 auto; padding: 4mm; }
      .center { text-align: center; } .right { text-align: right; } .bold { font-weight: bold; }
      .separator { border-top: 1px dashed #000; margin: 4px 0; }
      .business-name { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; } td { padding: 2px 0; }
      .total-row td { font-weight: bold; font-size: 14px; padding-top: 4px; }
      @media print { body { width: 72mm; } }
    </style></head><body>
      <div class="business-name">${receipt.business_name || 'COMMA'}</div>
      ${receipt.business_address ? `<div class="center">${receipt.business_address}</div>` : ''}
      ${receipt.business_phone ? `<div class="center">Tel: ${receipt.business_phone}</div>` : ''}
      <div class="separator"></div>
      <div>Receipt: ${receipt.receipt_number}</div>
      ${receipt.order_number ? `<div>Order: ${receipt.order_number}</div>` : ''}
      ${receipt.table_number ? `<div>Table: ${receipt.table_number}</div>` : ''}
      <div>Date: ${new Date(receipt.created_at).toLocaleString()}</div>
      ${receipt.cashier_name ? `<div>Cashier: ${receipt.cashier_name}</div>` : ''}
      <div class="separator"></div>
      <table><tr class="bold"><td>Item</td><td style="text-align:center">Qty</td><td style="text-align:right">Price</td><td style="text-align:right">Total</td></tr>${itemsHtml}</table>
      <div class="separator"></div>
      <table>
        <tr><td>Subtotal</td><td class="right">${Number(receipt.subtotal).toFixed(2)}</td></tr>
        ${Number(receipt.discount_amount) > 0 ? `<tr><td>Discount</td><td class="right">-${Number(receipt.discount_amount).toFixed(2)}</td></tr>` : ''}
        ${Number(receipt.tax_amount) > 0 ? `<tr><td>Tax (${receipt.tax_rate}%)</td><td class="right">${Number(receipt.tax_amount).toFixed(2)}</td></tr>` : ''}
        ${Number(receipt.service_charge_amount) > 0 ? `<tr><td>Service (${receipt.service_charge_rate}%)</td><td class="right">${Number(receipt.service_charge_amount).toFixed(2)}</td></tr>` : ''}
        <tr class="total-row"><td>TOTAL</td><td class="right">EGP ${Number(receipt.total).toFixed(2)}</td></tr>
      </table>
      <div class="separator"></div>
      <div>Payment: ${(receipt.payment_method || 'cash').toUpperCase()}</div>
      ${receipt.footer_message ? `<div class="separator"></div><div class="center">${receipt.footer_message}</div>` : ''}
      <div class="separator"></div>
      <div class="center" style="margin-top:8px">Thank you!</div>
      <script>window.onload=function(){window.print();setTimeout(function(){window.close();},500);};</script>
    </body></html>`;

    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1a1918', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '85vh', overflow: 'auto', border: '1px solid rgba(201,168,76,0.15)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{receipt.receipt_number}</h2>
              <p style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>{new Date(receipt.created_at).toLocaleDateString()}</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#999', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>
        </div>

        <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {receipt.order_number && <div><span style={{ color: '#999' }}>Order:</span> {receipt.order_number}</div>}
          {receipt.table_number && <div><span style={{ color: '#999' }}>Table:</span> {receipt.table_number}</div>}
          {receipt.cashier_name && <div><span style={{ color: '#999' }}>Cashier:</span> {receipt.cashier_name}</div>}
        </div>

        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Items</h3>
          {(receipt.items || []).map((item: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', borderBottom: i < receipt.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <div>
                <span>{item.item_name_en}</span>
                <span style={{ color: '#999', marginLeft: '8px' }}>x{item.quantity}</span>
              </div>
              <span style={{ fontWeight: 500 }}>EGP {Number(item.line_total).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 24px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Subtotal</span><span>EGP {Number(receipt.subtotal).toFixed(2)}</span></div>
          {Number(receipt.discount_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Discount</span><span style={{ color: '#F44336' }}>-EGP {Number(receipt.discount_amount).toFixed(2)}</span></div>}
          {Number(receipt.tax_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Tax ({receipt.tax_rate}%)</span><span>EGP {Number(receipt.tax_amount).toFixed(2)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(201,168,76,0.15)', fontSize: '16px', fontWeight: 700 }}>
            <span>Total</span><span style={{ color: '#c9a84c' }}>EGP {Number(receipt.total).toFixed(2)}</span>
          </div>
        </div>

        <div style={{ padding: '16px 24px' }}>
          <div style={{ fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ color: '#999' }}>Payment: </span>
            <span style={{ textTransform: 'uppercase', fontWeight: 500 }}>{receipt.payment_method || 'cash'}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={printReceipt} style={{ flex: 1, padding: '12px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              🖨️ Print
            </button>
            <button onClick={() => exportReceiptPDF(receipt)} style={{ flex: 1, padding: '12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              📥 PDF
            </button>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#c9a84c', color: '#0f0e0d', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
