'use client';

import { useMemo, useState } from 'react';
import { MENU } from '@/lib/data';
import { useLang } from '../LangProvider';
import { useOrders } from './OrdersProvider';
import type { Order, OrderStatus } from '@/lib/types';
import type { UIKey } from '@/lib/i18n';

type Line = { menuItemId: string; qty: number };

type Props = { open: boolean; onClose: () => void };

const STATUS_OPTIONS: { value: OrderStatus; key: UIKey }[] = [
  { value: 'Pending', key: 'pending' },
  { value: 'Preparing', key: 'preparing' },
  { value: 'Completed', key: 'completed' },
  { value: 'Cancelled', key: 'cancelled' },
];

export function AddOrderModal({ open, onClose }: Props) {
  const { lang, t } = useLang();
  const { addOrder, nextId } = useOrders();

  const [cust, setCust] = useState('');
  const [table, setTable] = useState('');
  const [status, setStatus] = useState<OrderStatus>('Pending');
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState('');

  const total = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const item = MENU.find((m) => m.id === l.menuItemId);
        return sum + (item ? item.price * l.qty : 0);
      }, 0),
    [lines]
  );

  function addLine() {
    setLines((prev) => [...prev, { menuItemId: MENU[0].id, qty: 1 }]);
  }

  function updateLine(idx: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function reset() {
    setCust('');
    setTable('');
    setStatus('Pending');
    setLines([]);
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function buildItemsString(l: 'en' | 'ar'): string {
    return lines
      .map(({ menuItemId, qty }) => {
        const item = MENU.find((m) => m.id === menuItemId);
        if (!item) return '';
        const name = item.name[l];
        return qty > 1 ? `${name} x${qty}` : name;
      })
      .filter(Boolean)
      .join(l === 'ar' ? '، ' : ', ');
  }

  function handleSave() {
    if (!cust.trim() || !table.trim() || lines.length === 0) {
      setError(t('validation_required'));
      return;
    }
    const statusKey =
      STATUS_OPTIONS.find((s) => s.value === status)?.key ?? 'pending';
    const order: Order = {
      id: nextId(),
      table: table.trim(),
      total,
      status,
      statusKey,
      time: t('just_now'),
      cust: { en: cust.trim(), ar: cust.trim() },
      items: {
        en: buildItemsString('en'),
        ar: buildItemsString('ar'),
      },
    };
    addOrder(order);
    handleClose();
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="section-title">{t('new_order')}</div>
            <div className="section-sub">{t('latest_activity')}</div>
          </div>
          <button type="button" className="modal-close" onClick={handleClose} aria-label={t('cancel')}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div className="modal-field">
              <label className="login-label">{t('customer_name')}</label>
              <input
                type="text"
                className="search-input"
                value={cust}
                onChange={(e) => setCust(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: أحمد ك.' : 'e.g. Ahmed K.'}
                style={{ padding: '10px 14px' }}
              />
            </div>
            <div className="modal-field">
              <label className="login-label">{t('table_number')}</label>
              <input
                type="text"
                className="search-input"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="T-04"
                style={{ padding: '10px 14px' }}
              />
            </div>
            <div className="modal-field">
              <label className="login-label">{t('status_label')}</label>
              <select
                className="search-input modal-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{t(s.key)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-items-head">
            <span className="login-label">{t('items_label')}</span>
            <button type="button" className="btn-ghost" style={{ padding: '6px 14px', fontSize: '0.75rem' }} onClick={addLine}>
              + {t('add_item')}
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="modal-empty">{t('no_items_yet')}</div>
          ) : (
            <div className="modal-lines">
              {lines.map((l, i) => {
                const item = MENU.find((m) => m.id === l.menuItemId);
                const lineTotal = item ? item.price * l.qty : 0;
                return (
                  <div key={i} className="modal-line">
                    <select
                      className="search-input modal-select"
                      value={l.menuItemId}
                      onChange={(e) => updateLine(i, { menuItemId: e.target.value })}
                    >
                      {MENU.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name[lang]} — {t('egp')} {m.price}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      className="search-input modal-qty"
                      value={l.qty}
                      onChange={(e) => updateLine(i, { qty: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    />
                    <div className="modal-line-total">{t('egp')} {lineTotal.toLocaleString()}</div>
                    <button type="button" className="modal-line-remove" onClick={() => removeLine(i)} aria-label={t('remove_item')}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {error && <p className="login-error" style={{ marginTop: 16 }}>{error}</p>}
        </div>

        <div className="modal-foot">
          <div className="modal-total">
            {t('total_label')}: <span>{t('egp')} {total.toLocaleString()}</span>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={handleClose}>{t('cancel')}</button>
            <button type="button" className="btn-primary" onClick={handleSave}>{t('save_order')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
