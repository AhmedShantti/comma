'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface MenuItem {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  base_price: number;
  image_url?: string;
  is_active: boolean;
  category_id: string;
  variants?: Array<{ id: string; name: string; price_adjustment: number }>;
}

interface Category {
  id: string;
  name_en: string;
  name_ar: string;
}

interface Addon {
  id: string;
  name_en: string;
  name_ar: string;
  price: number;
  is_active: boolean;
}

interface ItemForm {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  base_price: string;
  category_id: string;
  image_url: string;
  is_active: boolean;
}

interface AdminItemModalProps {
  item: MenuItem | null;
  categories: Category[];
  onSave: (form: ItemForm) => Promise<void>;
  onClose: () => void;
}

const EMPTY_ITEM: ItemForm = {
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  base_price: '',
  category_id: '',
  image_url: '',
  is_active: true,
};

export function AdminItemModal({ item, categories, onSave, onClose }: AdminItemModalProps) {
  const [form, setForm] = useState<ItemForm>(
    item
      ? {
          name_en: item.name_en,
          name_ar: item.name_ar,
          description_en: item.description_en ?? '',
          description_ar: item.description_ar ?? '',
          base_price: String(item.base_price),
          category_id: item.category_id,
          image_url: item.image_url ?? '',
          is_active: item.is_active,
        }
      : { ...EMPTY_ITEM, category_id: categories[0]?.id ?? '' }
  );

  const [variants, setVariants] = useState<Array<{ id: string; name: string; price_adjustment: number }>>(
    item?.variants ?? []
  );
  const [allAddons, setAllAddons] = useState<Addon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadingAddons, setLoadingAddons] = useState(true);

  // Fetch all add-ons
  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const addons = await api.addons.getAll();
        setAllAddons(Array.isArray(addons) ? addons : addons?.data ?? []);
      } catch (err) {
        console.error('Failed to load add-ons:', err);
      } finally {
        setLoadingAddons(false);
      }
    };
    fetchAddons();
  }, []);

  const set = (k: keyof ItemForm, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.name_en.trim() || !form.name_ar.trim() || !form.base_price || !form.category_id) {
      setError('Name (EN/AR), price, and category are required.');
      return;
    }
    const price = parseFloat(form.base_price);
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await onSave(form);
    } catch (e: any) {
      setError(e.message || 'Failed to save item.');
      setSaving(false);
    }
  }

  const isEdit = !!item;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 700, maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="section-title">{isEdit ? 'Edit Item' : 'Add New Item'}</div>
          <button className="modal-close" onClick={onClose} disabled={saving}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Names */}
          <div className="modal-grid" style={{ marginBottom: 16 }}>
            <div className="modal-field">
              <label className="login-label">Name (English) *</label>
              <input
                className="search-input"
                value={form.name_en}
                onChange={e => set('name_en', e.target.value)}
                placeholder="e.g. Cappuccino"
                style={{ padding: '10px 14px' }}
                disabled={saving}
              />
            </div>
            <div className="modal-field">
              <label className="login-label">الاسم (عربي) *</label>
              <input
                className="search-input"
                value={form.name_ar}
                dir="rtl"
                onChange={e => set('name_ar', e.target.value)}
                placeholder="مثال: كابتشينو"
                style={{ padding: '10px 14px' }}
                disabled={saving}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="modal-grid" style={{ marginBottom: 16 }}>
            <div className="modal-field">
              <label className="login-label">Description (EN)</label>
              <textarea
                className="search-input"
                value={form.description_en}
                onChange={e => set('description_en', e.target.value)}
                rows={2}
                style={{ padding: '10px 14px', resize: 'vertical', fontFamily: 'inherit' }}
                disabled={saving}
              />
            </div>
            <div className="modal-field">
              <label className="login-label">الوصف (عربي)</label>
              <textarea
                className="search-input"
                value={form.description_ar}
                dir="rtl"
                onChange={e => set('description_ar', e.target.value)}
                rows={2}
                style={{ padding: '10px 14px', resize: 'vertical', fontFamily: 'inherit' }}
                disabled={saving}
              />
            </div>
          </div>

          {/* Price + Category */}
          <div className="modal-grid" style={{ marginBottom: 16 }}>
            <div className="modal-field">
              <label className="login-label">Price (ILS) *</label>
              <input
                className="search-input"
                type="number"
                min="1"
                step="0.5"
                value={form.base_price}
                onChange={e => set('base_price', e.target.value)}
                placeholder="75"
                style={{ padding: '10px 14px' }}
                disabled={saving}
              />
            </div>
            <div className="modal-field">
              <label className="login-label">Category *</label>
              <select
                className="search-input modal-select"
                value={form.category_id}
                onChange={e => set('category_id', e.target.value)}
                disabled={saving}
              >
                <option value="">— Select category —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="modal-field" style={{ marginBottom: 16 }}>
            <label className="login-label">Image URL</label>
            <input
              className="search-input"
              value={form.image_url}
              onChange={e => set('image_url', e.target.value)}
              placeholder="https://images.unsplash.com/…"
              style={{ padding: '10px 14px' }}
              disabled={saving}
            />
          </div>

          {/* Image preview */}
          {form.image_url && (
            <div style={{ marginBottom: 16 }}>
              <img
                src={form.image_url}
                alt="preview"
                style={{
                  width: '100%',
                  maxHeight: 160,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                }}
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Variants Section */}
          <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <label className="login-label" style={{ color: 'var(--gold)', marginBottom: 12, display: 'block' }}>
              VARIANTS
            </label>
            {variants.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No variants added yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {variants.map((v, idx) => (
                  <div key={idx} style={{ padding: 8, background: 'var(--bg-elevated)', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#e8e0d0', fontSize: '0.9rem' }}>
                      {v.name} {v.price_adjustment > 0 && `(+$${v.price_adjustment.toFixed(2)})`}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>
              💡 Manage variants in the Variants section of the dashboard
            </p>
          </div>

          {/* Add-ons Section */}
          <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <label className="login-label" style={{ color: 'var(--gold)', marginBottom: 12, display: 'block' }}>
              ADD-ONS
            </label>
            {loadingAddons ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading add-ons...</p>
            ) : allAddons.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No add-ons available</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allAddons.filter(a => a.is_active).map(addon => (
                  <label
                    key={addon.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: 8,
                      borderRadius: 4,
                      background: selectedAddons.includes(addon.id) ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedAddons([...selectedAddons, addon.id]);
                        } else {
                          setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                        }
                      }}
                      disabled={saving}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ flex: 1, color: '#e8e0d0', fontSize: '0.9rem' }}>
                      {addon.name_en}
                    </span>
                    <span style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                      +${Number(addon.price).toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <label className="login-label" style={{ margin: 0 }}>
              Available
            </label>
            <button
              type="button"
              onClick={() => set('is_active', !form.is_active)}
              disabled={saving}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                background: form.is_active ? 'var(--gold)' : 'var(--bg-elevated)',
                position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 3,
                  left: form.is_active ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: form.is_active ? 'var(--bg)' : 'var(--text-muted)',
                  transition: 'left 0.2s',
                }}
              />
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {form.is_active ? 'Showing on menu' : 'Hidden from menu'}
            </span>
          </div>

          {error && <p className="login-error" style={{ marginTop: 14 }}>{error}</p>}
        </div>

        <div className="modal-foot">
          <div className="modal-actions">
            <button className="btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
