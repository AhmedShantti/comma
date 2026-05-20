'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { mockCategories, mockMenuItems } from '@/lib/mockData';
import { useLang } from '../LangProvider';
import { useAuth } from '../AuthProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = { id: string; name_en: string; name_ar: string; sort_order: number; is_active: boolean };

type MenuItem = {
  id: string;
  category_id: string;
  name_en: string; name_ar: string;
  description_en?: string; description_ar?: string;
  base_price: number;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
};

type ItemForm = {
  name_en: string; name_ar: string;
  description_en: string; description_ar: string;
  base_price: string;
  category_id: string;
  image_url: string;
  is_active: boolean;
};

type CatForm = { name_en: string; name_ar: string };

const EMPTY_ITEM: ItemForm = {
  name_en: '', name_ar: '', description_en: '', description_ar: '',
  base_price: '', category_id: '', image_url: '', is_active: true,
};
const EMPTY_CAT: CatForm = { name_en: '', name_ar: '' };

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="section-title" style={{ fontSize: '1rem' }}>Confirm</div>
          <button className="modal-close" onClick={onCancel}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-foot">
          <div className="modal-actions">
            <button className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button
              className="btn-primary"
              style={{ background: '#d45454', borderColor: '#d45454' }}
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Item Modal ───────────────────────────────────────────────────────────────

function ItemModal({ item, categories, onSave, onClose }: {
  item: MenuItem | null;
  categories: Category[];
  onSave: (form: ItemForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ItemForm>(
    item
      ? {
          name_en: item.name_en, name_ar: item.name_ar,
          description_en: item.description_en ?? '',
          description_ar: item.description_ar ?? '',
          base_price: String(item.base_price),
          category_id: item.category_id,
          image_url: item.image_url ?? '',
          is_active: item.is_active,
        }
      : { ...EMPTY_ITEM, category_id: categories[0]?.id ?? '' }
  );

  // Auto-select first category if form has no category yet (race-condition safety)
  useEffect(() => {
    if (!form.category_id && categories.length > 0) {
      setForm(f => ({ ...f, category_id: categories[0].id }));
    }
  }, [categories, form.category_id]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof ItemForm, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.name_en.trim() || !form.name_ar.trim() || !form.base_price || !form.category_id) {
      setError('Name (EN/AR), price, and category are required.');
      return;
    }
    const price = parseFloat(form.base_price);
    if (isNaN(price) || price <= 0) { setError('Price must be a positive number.'); return; }
    try { setSaving(true); setError(''); await onSave(form); }
    catch (e: any) { setError(e.message || 'Failed to save item.'); setSaving(false); }
  }

  const isEdit = !!item;

  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="section-title">{isEdit ? 'Edit Item' : 'Add New Item'}</div>
          <button className="modal-close" onClick={onClose} disabled={saving}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Names */}
          <div className="modal-grid" style={{ marginBottom: 16 }}>
            <div className="modal-field">
              <label className="login-label">Name (English) *</label>
              <input className="search-input" value={form.name_en}
                onChange={e => set('name_en', e.target.value)}
                placeholder="e.g. Cappuccino" style={{ padding: '10px 14px' }} disabled={saving} />
            </div>
            <div className="modal-field">
              <label className="login-label">الاسم (عربي) *</label>
              <input className="search-input" value={form.name_ar} dir="rtl"
                onChange={e => set('name_ar', e.target.value)}
                placeholder="مثال: كابتشينو" style={{ padding: '10px 14px' }} disabled={saving} />
            </div>
          </div>

          {/* Descriptions */}
          <div className="modal-grid" style={{ marginBottom: 16 }}>
            <div className="modal-field">
              <label className="login-label">Description (EN)</label>
              <textarea className="search-input" value={form.description_en}
                onChange={e => set('description_en', e.target.value)}
                rows={3} style={{ padding: '10px 14px', resize: 'vertical', fontFamily: 'inherit' }}
                disabled={saving} />
            </div>
            <div className="modal-field">
              <label className="login-label">الوصف (عربي)</label>
              <textarea className="search-input" value={form.description_ar} dir="rtl"
                onChange={e => set('description_ar', e.target.value)}
                rows={3} style={{ padding: '10px 14px', resize: 'vertical', fontFamily: 'inherit' }}
                disabled={saving} />
            </div>
          </div>

          {/* Price + Category */}
          <div className="modal-grid" style={{ marginBottom: 16 }}>
            <div className="modal-field">
              <label className="login-label">Price (ILS) *</label>
              <input className="search-input" type="number" min="1" step="0.5"
                value={form.base_price}
                onChange={e => set('base_price', e.target.value)}
                placeholder="75" style={{ padding: '10px 14px' }} disabled={saving} />
            </div>
            <div className="modal-field">
              <label className="login-label">Category *</label>
              <select className="search-input modal-select" value={form.category_id}
                onChange={e => set('category_id', e.target.value)} disabled={saving}>
                <option value="">— Select category —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name_en}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="modal-field" style={{ marginBottom: 16 }}>
            <label className="login-label">Image URL</label>
            <input className="search-input" value={form.image_url}
              onChange={e => set('image_url', e.target.value)}
              placeholder="https://images.unsplash.com/…"
              style={{ padding: '10px 14px' }} disabled={saving} />
          </div>

          {/* Image preview */}
          {form.image_url && (
            <div style={{ marginBottom: 16 }}>
              <img src={form.image_url} alt="preview"
                style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8,
                  border: '1px solid var(--border)' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}

          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <label className="login-label" style={{ margin: 0 }}>Available</label>
            <button
              type="button"
              onClick={() => set('is_active', !form.is_active)}
              disabled={saving}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                background: form.is_active ? 'var(--gold)' : 'var(--bg-elevated)',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: form.is_active ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: form.is_active ? 'var(--bg)' : 'var(--text-muted)',
                transition: 'left 0.2s',
              }} />
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {form.is_active ? 'Showing on menu' : 'Hidden from menu'}
            </span>
          </div>

          {error && <p className="login-error" style={{ marginTop: 14 }}>{error}</p>}
        </div>

        <div className="modal-foot">
          <div className="modal-actions">
            <button className="btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category Modal ───────────────────────────────────────────────────────────

function CatModal({ onSave, onClose }: {
  onSave: (form: CatForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CatForm>(EMPTY_CAT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!form.name_en.trim() || !form.name_ar.trim()) {
      setError('Both English and Arabic names are required.'); return;
    }
    try { setSaving(true); setError(''); await onSave(form); }
    catch (e: any) { setError(e.message || 'Failed to save category.'); setSaving(false); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="section-title">Add Category</div>
          <button className="modal-close" onClick={onClose} disabled={saving}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            <div className="modal-field">
              <label className="login-label">Name (English) *</label>
              <input className="search-input" value={form.name_en}
                onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
                placeholder="e.g. Hot Drinks" style={{ padding: '10px 14px' }} disabled={saving} />
            </div>
            <div className="modal-field">
              <label className="login-label">الاسم (عربي) *</label>
              <input className="search-input" value={form.name_ar} dir="rtl"
                onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))}
                placeholder="مثال: المشروبات الساخنة" style={{ padding: '10px 14px' }} disabled={saving} />
            </div>
          </div>
          {error && <p className="login-error" style={{ marginTop: 14 }}>{error}</p>}
        </div>
        <div className="modal-foot">
          <div className="modal-actions">
            <button className="btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Add Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────

function ItemCard({ item, catName, lang, onEdit, onDelete, onToggle }: {
  item: MenuItem; catName: string; lang: 'en' | 'ar';
  onEdit: () => void; onDelete: () => void; onToggle: () => void;
}) {
  const name = lang === 'ar' ? item.name_ar : item.name_en;

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden',
      opacity: item.is_active ? 1 : 0.55,
      transition: 'opacity 0.2s, border-color 0.2s',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 140, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.name_en}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {/* availability badge */}
        <span style={{
          position: 'absolute', top: 8, right: 8,
          background: item.is_active ? 'rgba(76,175,125,0.9)' : 'rgba(212,84,84,0.9)',
          color: '#fff', fontSize: '0.68rem', fontWeight: 600,
          padding: '2px 8px', borderRadius: 20, letterSpacing: '0.04em',
        }}>
          {item.is_active ? 'Available' : 'Hidden'}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.3 }}>
          {name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {lang === 'ar' ? item.name_en : item.name_ar}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 }}>
          <span style={{
            fontSize: '0.72rem', padding: '2px 8px', borderRadius: 6,
            background: 'var(--bg-elevated)', color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}>{catName}</span>
          <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>
            ILS {Number(item.base_price).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', borderTop: '1px solid var(--border)',
      }}>
        <button onClick={onToggle} title={item.is_active ? 'Hide from menu' : 'Show on menu'}
          style={{
            flex: 1, padding: '9px 0', background: 'none', border: 'none',
            borderRight: '1px solid var(--border)', cursor: 'pointer',
            color: item.is_active ? '#4caf7d' : 'var(--text-muted)',
            fontSize: '0.75rem', transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          {item.is_active ? '✓ Available' : '✕ Hidden'}
        </button>
        <button onClick={onEdit} title="Edit item"
          style={{
            flex: 1, padding: '9px 0', background: 'none', border: 'none',
            borderRight: '1px solid var(--border)', cursor: 'pointer',
            color: 'var(--text-soft)', fontSize: '0.75rem', transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          ✎ Edit
        </button>
        <button onClick={onDelete} title="Delete item"
          style={{
            flex: 1, padding: '9px 0', background: 'none', border: 'none',
            cursor: 'pointer', color: '#d45454', fontSize: '0.75rem', transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,84,84,0.07)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          ✕ Delete
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MenuManager() {
  const { lang } = useLang();
  const { logout } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems]           = useState<MenuItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeCat, setActiveCat]   = useState('all');
  const [search, setSearch]         = useState('');

  // Modals
  const [showItemModal, setShowItemModal]   = useState(false);
  const [editingItem, setEditingItem]       = useState<MenuItem | null>(null);
  const [showCatModal, setShowCatModal]     = useState(false);
  const [confirm, setConfirm]               = useState<{ type: 'item' | 'cat'; id: string; name: string } | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Using mock data for demo - replace with api calls when backend is ready
      setCategories(mockCategories);
      setItems(mockMenuItems);
    } catch (e: any) {
      if (e?.response?.status === 401) { await logout(); return; }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => { loadData(); }, [loadData]);

  // Filtered items
  const filtered = useMemo(() => {
    let list = activeCat === 'all' ? items : items.filter(i => i.category_id === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.name_en.toLowerCase().includes(q) || i.name_ar.includes(q)
      );
    }
    return list;
  }, [items, activeCat, search]);

  const catMap = useMemo(
    () => Object.fromEntries(categories.map(c => [c.id, c])),
    [categories]
  );

  // ── Item CRUD ──────────────────────────────────────────────────────────────
  async function handleSaveItem(form: ItemForm) {
    const payload = {
      name_en: form.name_en.trim(),
      name_ar: form.name_ar.trim(),
      description_en: form.description_en.trim() || undefined,
      description_ar: form.description_ar.trim() || undefined,
      base_price: parseFloat(form.base_price),
      category_id: form.category_id,
      image_url: form.image_url.trim() || undefined,
      is_active: form.is_active,
    };

    if (editingItem) {
      await api.menuItems.update(editingItem.id, payload);
    } else {
      await api.menuItems.create(payload);
    }
    setShowItemModal(false);
    setEditingItem(null);
    await loadData();
  }

  async function handleDeleteItem(id: string) {
    await api.menuItems.delete(id);
    setConfirm(null);
    await loadData();
  }

  async function handleToggleItem(item: MenuItem) {
    await api.menuItems.update(item.id, { is_active: !item.is_active });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
  }

  // ── Category CRUD ──────────────────────────────────────────────────────────
  async function handleSaveCat(form: CatForm) {
    await api.categories.create({
      name_en: form.name_en.trim(),
      name_ar: form.name_ar.trim(),
      sort_order: categories.length + 1,
    });
    setShowCatModal(false);
    await loadData();
  }

  async function handleDeleteCat(id: string) {
    await api.categories.delete(id);
    setConfirm(null);
    if (activeCat === id) setActiveCat('all');
    await loadData();
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading menu…
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 48px' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div className="section-title" style={{ fontSize: '1.15rem' }}>Menu Management</div>
          <div className="section-sub">{items.length} items · {categories.length} categories</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            onClick={() => setShowCatModal(true)}>
            + Add Category
          </button>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            onClick={() => { setEditingItem(null); setShowItemModal(true); }}>
            + Add Item
          </button>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20,
        paddingBottom: 16, borderBottom: '1px solid var(--border)',
      }}>
        <button
          className={`cat-tab${activeCat === 'all' ? ' active' : ''}`}
          onClick={() => setActiveCat('all')}
        >
          All ({items.length})
        </button>
        {categories.map(cat => {
          const count = items.filter(i => i.category_id === cat.id).length;
          return (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                className={`cat-tab${activeCat === cat.id ? ' active' : ''}`}
                onClick={() => setActiveCat(cat.id)}
              >
                {lang === 'ar' ? cat.name_ar : cat.name_en} ({count})
              </button>
              <button
                onClick={() => setConfirm({ type: 'cat', id: cat.id, name: cat.name_en })}
                title="Delete category"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.7rem', padding: '2px 4px',
                  borderRadius: 4, lineHeight: 1,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d45454')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >✕</button>
            </div>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div style={{ marginBottom: 20, maxWidth: 340 }}>
        <input
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items…"
          style={{ padding: '10px 14px' }}
        />
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          color: 'var(--text-muted)', fontSize: '0.9rem',
          border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
        }}>
          {search ? `No items match "${search}"` : 'No items in this category yet.'}
          <br />
          <button className="btn-ghost"
            style={{ marginTop: 16, padding: '8px 20px', fontSize: '0.8rem' }}
            onClick={() => { setEditingItem(null); setShowItemModal(true); }}>
            + Add the first item
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              catName={catMap[item.category_id]
                ? (lang === 'ar' ? catMap[item.category_id].name_ar : catMap[item.category_id].name_en)
                : '—'}
              lang={lang}
              onEdit={() => { setEditingItem(item); setShowItemModal(true); }}
              onDelete={() => setConfirm({ type: 'item', id: item.id, name: item.name_en })}
              onToggle={() => handleToggleItem(item)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {showItemModal && (
        <ItemModal
          item={editingItem}
          categories={categories}
          onSave={handleSaveItem}
          onClose={() => { setShowItemModal(false); setEditingItem(null); }}
        />
      )}

      {showCatModal && (
        <CatModal
          onSave={handleSaveCat}
          onClose={() => setShowCatModal(false)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={
            confirm.type === 'item'
              ? `Delete "${confirm.name}"? This cannot be undone.`
              : `Delete category "${confirm.name}"? All items in it will be uncategorized.`
          }
          onConfirm={() =>
            confirm.type === 'item'
              ? handleDeleteItem(confirm.id)
              : handleDeleteCat(confirm.id)
          }
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
