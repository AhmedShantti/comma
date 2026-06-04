'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { useAuth } from '../AuthProvider';
import type { Table } from '@/lib/types';
import { TableOrderPanel } from './TableOrderPanel';

type TableStatusValue = 'available' | 'occupied' | 'reserved';

type TableForm = {
  table_number: string;
  capacity: string;
  status: TableStatusValue;
  location: string;
  notes: string;
};

const EMPTY_TABLE: TableForm = {
  table_number: '',
  capacity: '4',
  status: 'available',
  location: '',
  notes: '',
};

const TABLE_STATUSES: { value: TableStatusValue; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
];

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
            <button className="btn-primary" style={{ background: '#d45454', borderColor: '#d45454' }} onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableModal({ table, onSave, onClose }: {
  table: Table | null;
  onSave: (form: TableForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<TableForm>(
    table
      ? {
          table_number: String(table.table_number),
          capacity: String(table.capacity),
          status: (table.status as TableStatusValue) ?? 'available',
          location: table.location ?? '',
          notes: table.notes ?? '',
        }
      : { ...EMPTY_TABLE }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof TableForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.table_number.trim()) {
      setError('Table number is required.');
      return;
    }
    const num = parseInt(form.table_number, 10);
    if (isNaN(num) || num < 1 || num > 999) {
      setError('Table number must be between 1 and 999.');
      return;
    }
    const cap = parseInt(form.capacity, 10);
    if (isNaN(cap) || cap < 1 || cap > 20) {
      setError('Capacity must be between 1 and 20.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await onSave(form);
    } catch (e: any) {
      setError(e.message || 'Failed to save table.');
      setSaving(false);
    }
  }

  const isEdit = !!table;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="section-title">{isEdit ? 'Edit Table' : 'Add New Table'}</div>
          <button className="modal-close" onClick={onClose} disabled={saving}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid" style={{ marginBottom: 16 }}>
            <div className="modal-field">
              <label className="login-label">Table Number *</label>
              <input className="search-input" type="number" min="1" max="999" value={form.table_number}
                onChange={e => set('table_number', e.target.value)}
                placeholder="e.g. 5" style={{ padding: '10px 14px' }} disabled={saving} />
            </div>
            <div className="modal-field">
              <label className="login-label">Capacity *</label>
              <input className="search-input" type="number" min="1" max="20" value={form.capacity}
                onChange={e => set('capacity', e.target.value)}
                placeholder="4" style={{ padding: '10px 14px' }} disabled={saving} />
            </div>
          </div>

          <div className="modal-field" style={{ marginBottom: 16 }}>
            <label className="login-label">Status *</label>
            <select className="search-input modal-select" value={form.status}
              onChange={e => set('status', e.target.value)} disabled={saving}>
              {TABLE_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="modal-field" style={{ marginBottom: 16 }}>
            <label className="login-label">Location</label>
            <input className="search-input" value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="e.g. Near window" style={{ padding: '10px 14px' }} disabled={saving} />
          </div>

          <div className="modal-field" style={{ marginBottom: 16 }}>
            <label className="login-label">Notes</label>
            <textarea className="search-input" value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={2} style={{ padding: '10px 14px', resize: 'vertical', fontFamily: 'inherit' }}
              disabled={saving} />
          </div>

          {error && <p className="login-error" style={{ marginTop: 14 }}>{error}</p>}
        </div>

        <div className="modal-foot">
          <div className="modal-actions">
            <button className="btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Table'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    available: '#4caf7d',
    occupied: '#5b8db8',
    reserved: '#e8a838',
  };
  const labels: Record<string, string> = {
    available: 'Available',
    occupied: 'Occupied',
    reserved: 'Reserved',
  };
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 4,
      backgroundColor: colors[status] ?? '#888',
      color: '#fff',
      fontSize: '0.85rem',
      fontWeight: 600,
    }}>
      {labels[status] ?? status}
    </span>
  );
}

export function TablesManager() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [orderTableId, setOrderTableId] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  const loadTables = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await api.tables.getAll();
      setTables(Array.isArray(result) ? result : result?.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  async function handleSave(form: TableForm) {
    try {
      const payload = {
        table_number: parseInt(form.table_number, 10),
        capacity: parseInt(form.capacity, 10),
        status: form.status,
        location: form.location || undefined,
        notes: form.notes || undefined,
      };

      if (selectedTable) {
        await api.tables.update(selectedTable.id, payload);
      } else {
        await api.tables.create(payload);
      }

      await loadTables();
      setShowModal(false);
      setSelectedTable(null);
    } catch (e: any) {
      throw e;
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.tables.delete(deleteId);
      await loadTables();
      setDeleteId(null);
    } catch (e: any) {
      setError(e.message || 'Failed to delete table');
    }
  }

  const filtered = tables.filter(t =>
    String(t.table_number).includes(search) ||
    t.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '0 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="section-head">
        <h1 className="section-title">Restaurant Tables</h1>
        <button
          className="btn-primary"
          onClick={() => { setSelectedTable(null); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span>+</span> Add Table
        </button>
      </div>

      {error && (
        <div style={{
          padding: 12,
          marginBottom: 16,
          borderRadius: 6,
          backgroundColor: '#ff6b6b',
          color: '#fff',
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input
          className="search-input"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by table number or location…"
          style={{ padding: '10px 14px' }}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading tables…</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
          {tables.length === 0 ? 'No tables yet. Add one to get started.' : 'No tables match your search.'}
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(table => (
            <div
              key={table.id}
              style={{
                padding: 16,
                border: '1px solid var(--border)',
                borderRadius: 8,
                backgroundColor: 'var(--bg-elevated)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1.5fr auto',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Table Number</p>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>Table {table.table_number}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Capacity</p>
                <p style={{ fontSize: '1rem' }}>{table.capacity} seats</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Status</p>
                <StatusBadge status={table.status} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Location</p>
                <p style={{ fontSize: '1rem' }}>{table.location || '—'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Table UUID (QR Link)</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    padding: '4px 8px',
                    background: 'var(--bg)',
                    borderRadius: 4,
                    wordBreak: 'break-all',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {table.id}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`/menu/${table.id}`);
                      alert('QR link copied to clipboard!');
                    }}
                    title="Copy QR link"
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                  disabled={orderLoading === table.id}
                  onClick={async () => {
                    try {
                      setOrderLoading(table.id);
                      const order = await api.orders.openOrCreateTableOrder(table.id);
                      setActiveOrder(order);
                      setOrderTableId(table.id);
                    } catch (e: any) {
                      alert(e.message || 'Failed to open order');
                    } finally {
                      setOrderLoading(null);
                    }
                  }}
                >
                  {orderLoading === table.id ? 'Opening…' : table.status === 'occupied' ? '📋 View Order' : '➕ New Order'}
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  onClick={() => { setSelectedTable(table); setShowModal(true); }}
                >
                  Edit
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#d45454' }}
                  onClick={() => setDeleteId(table.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TableModal
          table={selectedTable}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setSelectedTable(null); }}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this table?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Table Order Detail Panel */}
      {orderTableId && activeOrder && (
        <TableOrderPanel
          order={activeOrder}
          tableId={orderTableId}
          onClose={() => { setOrderTableId(null); setActiveOrder(null); loadTables(); }}
          onOrderUpdate={(updated: any) => setActiveOrder(updated)}
        />
      )}
    </div>
  );
}
