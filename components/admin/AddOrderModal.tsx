'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { useOrders } from './OrdersProvider';
import { useAuth } from '../AuthProvider';
import type { UIKey } from '@/lib/i18n';

type MenuItem = {
  id: string;
  name: { en: string; ar: string };
  price: number;
  cat?: string;
};

type Category = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
};

type Table = {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
};

type Line = { menuItemId: string; qty: number };

type Props = { open: boolean; onClose: () => void };

const STATUS_OPTIONS: { value: string; key: UIKey }[] = [
  { value: 'Pending', key: 'pending' },
  { value: 'Preparing', key: 'preparing' },
  { value: 'Completed', key: 'completed' },
  { value: 'Cancelled', key: 'cancelled' },
];

export function AddOrderModal({ open, onClose }: Props) {
  const { lang, t } = useLang();
  const { logout } = useAuth();
  const { createOrder, refreshOrders } = useOrders();

  const [cust, setCust] = useState('');
  const [tableId, setTableId] = useState('');
  const [status, setStatus] = useState('Pending');
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [activeCat, setActiveCat] = useState('all');
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      try {
        setLoadingData(true);
        const [catsRes, itemsRes, tablesRes] = await Promise.all([
          api.categories.getAll('limit=100'),
          api.menuItems.getAll('limit=100&is_active=true'),
          api.tables.getAll(),
        ]);
        const catsData  = Array.isArray(catsRes)  ? catsRes  : (catsRes?.data  ?? []);
        const itemsData = Array.isArray(itemsRes) ? itemsRes : (itemsRes?.data ?? []);
        const tablesData = Array.isArray(tablesRes) ? tablesRes : (tablesRes?.data ?? []);
        // Map backend shape → local shape expected by this modal
        // Backend Category: { id, name_en, name_ar, ... }
        // Backend MenuItem:  { id, name_en, name_ar, base_price, category_id, ... }
        const cats = (catsData || []).map((c: any) => ({
          id: c.id,
          slug: c.id,  // use id as slug since backend has no slug field
          name: { en: c.name_en ?? c.name ?? '', ar: c.name_ar ?? c.name ?? '' },
        }));
        const items = (itemsData || []).map((m: any) => ({
          id: m.id,
          name: { en: m.name_en ?? m.name ?? '', ar: m.name_ar ?? m.name ?? '' },
          price: Number(m.base_price ?? m.price ?? 0),
          cat: m.category_id,  // matches cat.slug (which is cat.id)
        }));
        const tblList = (tablesData || []).map((t: any) => ({
          id: t.id,
          table_number: t.table_number,
          capacity: t.capacity,
          status: t.status,
        }));
        setCategories(cats);
        setMenuItems(items);
        setTables(tblList);
      } catch (err) {
        if ((err as any)?.response?.status === 401) {
          await logout();
          return;
        }
        setError('Failed to load data');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [open, logout]);

  const total = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const item = menuItems.find((m) => m.id === l.menuItemId);
        return sum + (item ? item.price * l.qty : 0);
      }, 0),
    [lines, menuItems]
  );

  const filteredItems = useMemo(
    () =>
      activeCat === 'all'
        ? menuItems
        : menuItems.filter((item) => item.cat === activeCat),
    [menuItems, activeCat]
  );

  function addLine() {
    if (filteredItems.length === 0) return;
    setLines((prev) => [...prev, { menuItemId: filteredItems[0].id, qty: 1 }]);
  }

  function updateLine(idx: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function reset() {
    setCust('');
    setTableId('');
    setStatus('Pending');
    setLines([]);
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSave() {
    if (!cust.trim() || !tableId || lines.length === 0) {
      setError(t('validation_required'));
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const selectedTable = tables.find(t => t.id === tableId);
      const orderData = {
        type: 'dine_in',   // matches backend OrderType enum: dine_in | takeaway | delivery
        table_id: tableId,
        table_number: selectedTable?.table_number,
        customer_name: cust.trim(),
        // Note: status is ignored by backend (whitelist: true) — order always starts as 'open'
        items: lines.map((line) => ({
          menu_item_id: line.menuItemId,
          quantity: line.qty,
        })),
      };
      await createOrder(orderData);
      handleClose();
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        await logout();
        return;
      }
      setError((err as any)?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  if (loadingData) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-head">
            <div className="section-title">{t('new_order')}</div>
          </div>
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading menu...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="section-title">{t('new_order')}</div>
            <div className="section-sub">{t('latest_activity')}</div>
          </div>
          <button type="button" className="modal-close" onClick={handleClose} aria-label={t('cancel')} disabled={submitting}>
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
                disabled={submitting}
              />
            </div>
            <div className="modal-field">
              <label className="login-label">{t('table_number')} *</label>
              <select
                className="search-input modal-select"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                style={{ padding: '10px 14px' }}
                disabled={submitting}
              >
                <option value="">— Select table —</option>
                {tables.map(tbl => (
                  <option key={tbl.id} value={tbl.id}>
                    Table {tbl.table_number} ({tbl.capacity} seats)
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label className="login-label">{t('status_label')}</label>
              <select
                className="search-input modal-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={submitting}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{t(s.key)}</option>
                ))}
              </select>
            </div>
          </div>

          {categories.length > 0 && (
            <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <button
                type="button"
                className={`cat-tab${activeCat === 'all' ? ' active' : ''}`}
                onClick={() => setActiveCat('all')}
                style={{ marginRight: '8px' }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-tab${activeCat === cat.slug ? ' active' : ''}`}
                  onClick={() => setActiveCat(cat.slug)}
                  style={{ marginRight: '8px' }}
                >
                  {cat.name[lang]}
                </button>
              ))}
            </div>
          )}

          <div className="modal-items-head">
            <span className="login-label">{t('items_label')}</span>
            <button
              type="button"
              className="btn-ghost"
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
              onClick={addLine}
              disabled={submitting || filteredItems.length === 0}
            >
              + {t('add_item')}
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="modal-empty">{t('no_items_yet')}</div>
          ) : (
            <div className="modal-lines">
              {lines.map((l, i) => {
                const item = menuItems.find((m) => m.id === l.menuItemId);
                const lineTotal = item ? item.price * l.qty : 0;
                return (
                  <div key={i} className="modal-line">
                    <select
                      className="search-input modal-select"
                      value={l.menuItemId}
                      onChange={(e) => updateLine(i, { menuItemId: e.target.value })}
                      disabled={submitting}
                    >
                      {menuItems.map((m) => (
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
                      disabled={submitting}
                    />
                    <div className="modal-line-total">{t('egp')} {lineTotal.toLocaleString()}</div>
                    <button
                      type="button"
                      className="modal-line-remove"
                      onClick={() => removeLine(i)}
                      aria-label={t('remove_item')}
                      disabled={submitting}
                    >
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
            <button type="button" className="btn-ghost" onClick={handleClose} disabled={submitting}>
              {t('cancel')}
            </button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={submitting}>
              {submitting ? 'Creating...' : t('save_order')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
