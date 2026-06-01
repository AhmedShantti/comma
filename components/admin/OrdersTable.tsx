'use client';

import { useState } from 'react';
import { useLang } from '../LangProvider';
import { useOrders } from './OrdersProvider';
import type { OrderStatus } from '@/lib/types';

const TERMINAL_STATUSES = ['completed', 'paid', 'cancelled', 'refunded'];

export function OrdersTable() {
  const { lang, t } = useLang();
  const { orders, loading, error, updateOrderStatus, deleteOrder, refreshOrders } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
    </div>
  );
}