'use client';

import { useLang } from '../LangProvider';
import { useOrders } from './OrdersProvider';
import { timeAgoTranslate } from '@/lib/i18n';

export function OrdersTable() {
  const { lang, t } = useLang();
  const { orders: ORDERS } = useOrders();
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
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id}>
                <td className="order-id">{o.id}</td>
                <td className="order-cust">{o.cust[lang]}</td>
                <td className="order-table">{o.table}</td>
                <td className="order-items">{o.items[lang]}</td>
                <td className="order-total">{t('egp')} {o.total.toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${o.status.toLowerCase()}`}>{t(o.statusKey)}</span>
                </td>
                <td className="order-time">{timeAgoTranslate(o.time, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-foot">
        <span className="table-foot-text">
          {lang === 'ar'
            ? `عرض ${ORDERS.length} من 1,247 طلب`
            : `Showing ${ORDERS.length} of 1,247 orders`}
        </span>
        <div className="pagination">
          <button className="page-btn">{lang === 'ar' ? '→' : '←'}</button>
          <button className="page-btn">{lang === 'ar' ? '←' : '→'}</button>
        </div>
      </div>
    </div>
  );
}
