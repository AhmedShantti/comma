'use client';

import { useState } from 'react';
import { useLang } from '../LangProvider';
import { useOrders } from './OrdersProvider';
import { api } from '@/lib/api';
import type { OrderStatus } from '@/lib/types';

const TERMINAL_STATUSES = ['completed', 'paid', 'cancelled', 'refunded'];

export function OrdersTable() {
  const { lang, t } = useLang();
  const { orders, loading, error, updateOrderStatus, deleteOrder, refreshOrders } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const handleAdvanceStatus = async (orderId: string, currentStatus: string) => {
    const statusFlow: Record<string, string> = {
      open:      'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready:     'completed',
    };
    const nextStatus = statusFlow[currentStatus];
    if (!nextStatus) return;
    try {
      await updateOrderStatus(orderId, nextStatus);
      // Refresh the selected order if it's currently open in the modal
      if (selectedOrder?.id === orderId) {
        const updatedOrder = await api.orders.getById(orderId);
        setSelectedOrder(updatedOrder);
      }
      await refreshOrders();
    } catch (err) {
      alert(`Failed to update order: ${(err as any)?.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (orderId: string) => {
    const reason = window.prompt('Reason for cancellation:', 'Cancelled by manager');
    if (reason === null) return;
    try {
      await deleteOrder(orderId, reason || 'Cancelled by manager');
    } catch (err) {
      alert(`Failed to cancel order: ${(err as any)?.message || 'Unknown error'}`);
    }
  };

  const handleOpen = async (orderId: string) => {
    try {
      const order = await api.orders.getById(orderId);
      setSelectedOrder(order);
    } catch (err) {
      alert(`Failed to open order: ${(err as any)?.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">{t('recent_orders')}</div>
            <div className="section-sub">{t('latest_activity')}</div>
          </div>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">{t('recent_orders')}</div>
            <div className="section-sub">{t('latest_activity')}</div>
          </div>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {error}
          <button
            onClick={refreshOrders}
            className="btn-ghost"
            style={{ marginTop: '12px', display: 'block', margin: '12px auto 0' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-head">
        <div>
          <div className="section-title">{t('recent_orders')}</div>
          <div className="section-sub">{t('latest_activity')}</div>
        </div>
        <button className="view-menu-btn" style={{ cursor: 'pointer' }}>
          {t('export_csv')}
        </button>
      </div>

      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['all', 'open', 'in_progress', 'confirmed', 'preparing', 'ready', 'completed', 'paid', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            className={`btn-ghost ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
            style={{ fontSize: '0.875rem', padding: '6px 12px' }}
          >
            {status === 'all' ? 'All' : t(status as any)}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>{t('order_id')}</th>
              <th>{t('customer')}</th>
              <th>{t('table_label')}</th>
              <th>{t('items_label')}</th>
              <th>{t('total_label')}</th>
              <th>{t('status_label')}</th>
              <th>{t('time_label')}</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const isTerminal = TERMINAL_STATUSES.includes(o.status);
                return (
                  <tr key={o.id}>
                    <td className="order-id">{o.orderNumber}</td>
                    <td className="order-cust">{o.cust?.[lang] || 'N/A'}</td>
                    <td className="order-table">{o.table || 'N/A'}</td>
                    <td className="order-items">{o.items?.[lang] || 'N/A'}</td>
                    <td className="order-total">{t('egp')} {(o.total || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${(o.status || 'pending').toLowerCase()}`}>
                        {t((o.statusKey || 'pending') as any)}
                      </span>
                    </td>
                    <td className="order-time">{o.time || 'N/A'}</td>
                    <td style={{ fontSize: '0.75rem' }}>
                      <button
                        onClick={() => handleOpen(o.id)}
                        className="btn-ghost"
                        style={{ padding: '4px 8px', marginBottom: '4px', width: '100%', background: '#c9a84c22', color: '#c9a84c' }}
                      >
                        Open
                      </button>
                      {isTerminal ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>—</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAdvanceStatus(o.id, o.status as OrderStatus)}
                            className="btn-ghost"
                            style={{ padding: '4px 8px', marginBottom: '4px', width: '100%' }}
                          >
                            Next
                          </button>
                          <button
                            onClick={() => handleDelete(o.id)}
                            className="btn-ghost"
                            style={{ padding: '4px 8px', color: '#d0021b', width: '100%' }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="table-foot">
        <span className="table-foot-text">
          {lang === 'ar'
            ? `عرض ${filteredOrders.length} من ${orders.length} طلب`
            : `Showing ${filteredOrders.length} of ${orders.length} orders`}
        </span>
      </div>

      {selectedOrder && (
        <OrderEditModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdate={(updated) => {
            setSelectedOrder(updated);
            refreshOrders();
          }}
        />
      )}
    </div>
  );
}

type OrderEditModalProps = {
  order: any;
  onClose: () => void;
  onOrderUpdate: (order: any) => void;
};

function OrderEditModal({ order, onClose, onOrderUpdate }: OrderEditModalProps) {
  const { lang } = useLang();
  const [showCheckout, setShowCheckout] = useState(false);
  const [payMethod, setPayMethod] = useState('cash');
  const [payAmount, setPayAmount] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const activeItems = (order?.items || []).filter((i: any) => !i.is_voided);

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
      }
    } catch (e: any) {
      setError(e.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  if (receipt) {
    return (
      <ReceiptModalDisplay
        receipt={receipt}
        onClose={() => {
          setReceipt(null);
          onClose();
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '85vh', overflow: 'auto', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Order {order.order_number}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Total: ILS {Number(order.total).toFixed(2)}</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>
        </div>

        {/* Order Info */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
          {order.customer_name && <div style={{ marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Customer:</span> {order.customer_name}</div>}
          {order.table_number && <div style={{ marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Table:</span> {order.table_number}</div>}
          <div style={{ marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Status:</span> <span style={{ textTransform: 'uppercase', fontWeight: 600, color: '#c9a84c' }}>{order.status}</span></div>
        </div>

        {/* Items */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Items ({activeItems.length})</h3>
          {activeItems.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No items</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeItems.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: i < activeItems.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: 8 }}>
                  <div>
                    <span>{lang === 'ar' ? item.item_name_ar : item.item_name_en}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>x{item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 500 }}>ILS {(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Subtotal</span><span>ILS {Number(order.subtotal).toFixed(2)}</span></div>
          {Number(order.discount_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Discount</span><span style={{ color: '#F44336' }}>-ILS {Number(order.discount_amount).toFixed(2)}</span></div>}
          {Number(order.tax_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Tax ({order.tax_rate}%)</span><span>ILS {Number(order.tax_amount).toFixed(2)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '16px', fontWeight: 700 }}>
            <span>Total</span><span style={{ color: '#c9a84c' }}>ILS {Number(order.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '16px 24px' }}>
          {error && <div style={{ padding: 10, marginBottom: 12, borderRadius: 6, background: '#ff6b6b22', border: '1px solid #ff6b6b', color: '#ff6b6b', fontSize: '0.85rem' }}>{error}</div>}
          {success && <div style={{ padding: 10, marginBottom: 12, borderRadius: 6, background: '#4caf5022', border: '1px solid #4caf50', color: '#4caf50', fontSize: '0.85rem' }}>{success}</div>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', background: 'var(--border)', color: 'var(--text-soft)', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              Close
            </button>
            {!['paid', 'completed', 'cancelled', 'refunded'].includes(order.status) && activeItems.length > 0 && (
              <button onClick={() => setShowCheckout(true)} style={{ flex: 1, padding: '12px', background: '#c9a84c', color: '#0f0e0d', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                💳 Checkout
              </button>
            )}
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCheckout(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: 28, maxWidth: 420, width: '90%', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20 }}>Checkout — Order {order.order_number}</h2>

              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Order Total</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c9a84c' }}>ILS {Number(order.total).toFixed(2)}</p>
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
                  placeholder={String(Number(order.total).toFixed(2))}
                  style={{ padding: '10px 14px' }} />
                {payAmount && parseFloat(payAmount) > Number(order.total) && (
                  <p style={{ fontSize: '0.8rem', color: '#4caf50', marginTop: 4 }}>
                    Change: ILS {(parseFloat(payAmount) - Number(order.total)).toFixed(2)}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowCheckout(false)} disabled={checkingOut}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1, padding: '12px 0', fontSize: '0.95rem' }} onClick={handleCheckout} disabled={checkingOut}>
                  {checkingOut ? 'Processing…' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type ReceiptModalDisplayProps = { receipt: any; onClose: () => void };

function ReceiptModalDisplay({ receipt, onClose }: ReceiptModalDisplayProps) {
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
      <table>
        <tr class="bold"><td>Item</td><td style="text-align:center">Qty</td><td style="text-align:right">Price</td><td style="text-align:right">Total</td></tr>
        ${itemsHtml}
      </table>
      <div class="separator"></div>
      <table>
        <tr><td>Subtotal</td><td class="right">${Number(receipt.subtotal).toFixed(2)}</td></tr>
        ${Number(receipt.discount_amount) > 0 ? `<tr><td>Discount</td><td class="right">-${Number(receipt.discount_amount).toFixed(2)}</td></tr>` : ''}
        ${Number(receipt.tax_amount) > 0 ? `<tr><td>Tax (${receipt.tax_rate}%)</td><td class="right">${Number(receipt.tax_amount).toFixed(2)}</td></tr>` : ''}
        <tr class="total-row"><td>TOTAL</td><td class="right">ILS ${Number(receipt.total).toFixed(2)}</td></tr>
      </table>
      <div class="separator"></div>
      <div>Payment: ${(receipt.payment_method || 'cash').toUpperCase()}</div>
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
              <div><span>{item.item_name_en}</span><span style={{ color: '#999', marginLeft: '8px' }}>x{item.quantity}</span></div>
              <span style={{ fontWeight: 500 }}>ILS {Number(item.line_total).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 24px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Subtotal</span><span>ILS {Number(receipt.subtotal).toFixed(2)}</span></div>
          {Number(receipt.discount_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Discount</span><span style={{ color: '#F44336' }}>-ILS {Number(receipt.discount_amount).toFixed(2)}</span></div>}
          {Number(receipt.tax_amount) > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: '#999' }}>Tax ({receipt.tax_rate}%)</span><span>ILS {Number(receipt.tax_amount).toFixed(2)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(201,168,76,0.15)', fontSize: '16px', fontWeight: 700 }}>
            <span>Total</span><span style={{ color: '#c9a84c' }}>ILS {Number(receipt.total).toFixed(2)}</span>
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
            <button onClick={() => {
              const itemsHtml = (receipt.items || []).map((item: any) =>
                `<tr><td>${item.item_name_en}</td><td style="text-align:center">${item.quantity}</td><td style="text-align:right">${Number(item.unit_price).toFixed(2)}</td><td style="text-align:right">${Number(item.line_total).toFixed(2)}</td></tr>`
              ).join('');
              const html = `<html><head><style>body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; width: 72mm; } table { width: 100%; border-collapse: collapse; } td { padding: 2px 0; } .center { text-align: center; } .right { text-align: right; } .separator { border-top: 1px dashed #000; margin: 4px 0; } .business-name { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 4px; }</style></head><body><div class="business-name">${receipt.business_name || 'COMMA'}</div>${receipt.business_address ? `<div class="center">${receipt.business_address}</div>` : ''}<div class="separator"></div><div>Receipt: ${receipt.receipt_number}</div>${receipt.order_number ? `<div>Order: ${receipt.order_number}</div>` : ''}<table><tr class="bold"><td>Item</td><td style="text-align:center">Qty</td><td style="text-align:right">Price</td><td style="text-align:right">Total</td></tr>${itemsHtml}</table><div class="separator"></div><table><tr><td>Subtotal</td><td class="right">ILS ${Number(receipt.subtotal).toFixed(2)}</td></tr>${Number(receipt.discount_amount) > 0 ? `<tr><td>Discount</td><td class="right">-ILS ${Number(receipt.discount_amount).toFixed(2)}</td></tr>` : ''}<tr style="font-weight: bold;"><td>TOTAL</td><td class="right">ILS ${Number(receipt.total).toFixed(2)}</td></tr></table><div class="separator"></div><div>Payment: ${(receipt.payment_method || 'cash').toUpperCase()}</div><div class="center" style="margin-top:8px">Thank you!</div></body></html>`;
              const blob = new Blob([html], { type: 'text/html' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `receipt-${receipt.receipt_number}.html`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }} style={{ flex: 1, padding: '12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
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