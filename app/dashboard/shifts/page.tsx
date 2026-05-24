'use client';

import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
}

interface Shift {
  id: string;
  user_id: string;
  user: User;
  opening_cash: number;
  closing_cash?: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string;
  notes?: string;
}

interface ListResponse<T> {
  data: T[];
  meta: {
    totalPages: number;
    currentPage?: number;
    total?: number;
  };
}

// ─── API Service ──────────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

// API Service methods matching your backend routes
const shiftsApi = {
  // GET /api/v1/shifts - get all shifts with pagination
  getAll: (page: number = 1, limit: number = 10, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return apiFetch<ListResponse<Shift>>(`/api/v1/shifts?${params}`);
  },

  // GET /api/v1/shifts/current - get current user's active shift
  current: () => apiFetch<Shift>('/api/v1/shifts/current'),

  // GET /api/v1/shifts/active - get all active shifts (assuming this exists)
  getActive: () => apiFetch<Shift[]>('/api/v1/shifts/active'),

  // GET /api/v1/shifts/{id} - get shift by ID
  getById: (id: string) => apiFetch<Shift>(`/api/v1/shifts/${id}`),

  // POST /api/v1/shifts/open - open a new shift
  create: (openingCash: number) =>
    apiFetch<Shift>('/api/v1/shifts/open', {
      method: 'POST',
      body: JSON.stringify({ opening_cash: openingCash }),
    }),

  // POST /api/v1/shifts/close - close current shift
  close: (closingCash: number, notes?: string) =>
    apiFetch<Shift>('/api/v1/shifts/close', {
      method: 'POST',
      body: JSON.stringify({ closing_cash: closingCash, notes: notes || undefined }),
    }),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins} min ago`;
}

function duration(start: string, end?: string) {
  const ms = new Date(end ?? new Date()).getTime() - new Date(start).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: 'open' | 'closed' }) {
  const isOpen = status === 'open';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
      fontFamily: 'inherit', letterSpacing: '0.02em',
      background: isOpen ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
      color: isOpen ? '#4ade80' : '#888',
      border: `1px solid ${isOpen ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: isOpen ? '#4ade80' : '#555',
        boxShadow: isOpen ? '0 0 6px #4ade80' : 'none',
      }} />
      {isOpen ? 'Open' : 'Closed'}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 440,
        background: '#1a1814', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ color: '#e8e0d0', fontSize: 14, fontWeight: 500 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Input Components ─────────────────────────────────────────────────────────
function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      <input {...props} style={{
        width: '100%', boxSizing: 'border-box',
        background: '#111', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '10px 12px',
        color: '#e8e0d0', fontSize: 14, fontFamily: 'inherit',
        outline: 'none',
      }} />
    </div>
  );
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      <textarea {...props} style={{
        width: '100%', boxSizing: 'border-box',
        background: '#111', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '10px 12px',
        color: '#e8e0d0', fontSize: 14, fontFamily: 'inherit',
        outline: 'none', resize: 'none',
      }} />
    </div>
  );
}

// ─── Open Shift Modal ─────────────────────────────────────────────────────────
function OpenShiftModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [cash, setCash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!cash || isNaN(Number(cash))) {
      setError('Enter a valid amount');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await shiftsApi.create(Number(cash));
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal onClose={onClose} title="Open Shift">
      <Input
        label="Opening Cash (ILS)"
        type="number"
        min="0"
        step="0.01"
        value={cash}
        onChange={e => setCash(e.target.value)}
        placeholder="0.00"
      />
      {error && <p style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onClose} style={{
          flex: 1, padding: '9px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
          background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 13,
        }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} style={{
          flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
          background: '#c9a84c', color: '#111', fontWeight: 600, cursor: 'pointer', fontSize: 13,
          opacity: loading ? 0.6 : 1,
        }}>{loading ? 'Opening…' : 'Open Shift'}</button>
      </div>
    </Modal>
  );
}

// ─── Close Shift Modal ────────────────────────────────────────────────────────
function CloseShiftModal({ shift, onClose, onSuccess }: { shift: Shift; onClose: () => void; onSuccess: () => void }) {
  const [cash, setCash] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const diff = cash ? Number(cash) - shift.opening_cash : null;

  async function handleSubmit() {
    if (!cash || isNaN(Number(cash))) {
      setError('Enter a valid amount');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await shiftsApi.close(Number(cash), notes || undefined);
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal onClose={onClose} title="Close Shift">
      <div style={{ background: '#111', borderRadius: 8, padding: '10px 12px', marginBottom: 14, fontSize: 12, color: '#666' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>Opened</span><span style={{ color: '#aaa' }}>{formatDate(shift.opened_at)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>Duration</span><span style={{ color: '#aaa' }}>{duration(shift.opened_at)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Opening Cash</span><span style={{ color: '#c9a84c', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(shift.opening_cash)}</span>
        </div>
      </div>
      <Input
        label="Closing Cash (ILS)"
        type="number"
        min="0"
        step="0.01"
        value={cash}
        onChange={e => setCash(e.target.value)}
        placeholder="0.00"
      />
      {diff !== null && (
        <p style={{ fontSize: 12, marginTop: -10, marginBottom: 12, color: diff >= 0 ? '#4ade80' : '#f87171' }}>
          {diff >= 0 ? '+' : ''}{formatCurrency(diff)} difference
        </p>
      )}
      <Textarea
        label="Notes (optional)"
        rows={2}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Any notes for this shift…"
      />
      {error && <p style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onClose} style={{
          flex: 1, padding: '9px 0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
          background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 13,
        }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} style={{
          flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
          background: 'rgba(239,68,68,0.15)', color: '#f87171',
          fontWeight: 600, cursor: 'pointer', fontSize: 13, opacity: loading ? 0.6 : 1,
        }}>{loading ? 'Closing…' : 'Close Shift'}</button>
      </div>
    </Modal>
  );
}

// ─── Shift Details Modal ──────────────────────────────────────────────────────
function ShiftDetailsModal({ shift, onClose }: { shift: Shift; onClose: () => void }) {
  const diff = shift.closing_cash != null ? shift.closing_cash - shift.opening_cash : null;
  return (
    <Modal onClose={onClose} title="Shift Details">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(201,168,76,0.15)', color: '#c9a84c',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>{shift.user?.name?.charAt(0) ?? '?'}</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#e8e0d0', fontSize: 14, margin: 0 }}>{shift.user?.name ?? '—'}</p>
          <p style={{ color: '#555', fontSize: 11, margin: 0 }}>{shift.user?.email}</p>
        </div>
        <StatusBadge status={shift.status} />
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Opening Cash', value: formatCurrency(shift.opening_cash), color: '#c9a84c' },
          { label: 'Closing Cash', value: shift.closing_cash != null ? formatCurrency(shift.closing_cash) : '—', color: '#e8e0d0' },
          { label: 'Duration', value: duration(shift.opened_at, shift.closed_at), color: '#e8e0d0' },
          diff != null ? { label: 'Difference', value: (diff >= 0 ? '+' : '') + formatCurrency(diff), color: diff >= 0 ? '#4ade80' : '#f87171' } : null,
        ].filter(Boolean).map((s: any) => (
          <div key={s.label} style={{ background: '#111', borderRadius: 8, padding: '10px 12px' }}>
            <p style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{s.label}</p>
            <p style={{ fontSize: 16, color: s.color, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Detail rows */}
      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
        {[
          { label: 'Opened At', value: formatDate(shift.opened_at) },
          shift.closed_at ? { label: 'Closed At', value: formatDate(shift.closed_at) } : null,
          shift.notes ? { label: 'Notes', value: shift.notes } : null,
          { label: 'Shift ID', value: shift.id, mono: true },
        ].filter(Boolean).map((row: any, i, arr) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '9px 12px', gap: 12,
            borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <span style={{ fontSize: 11, color: '#555', flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontSize: row.mono ? 10 : 12, color: '#aaa', textAlign: 'right', wordBreak: 'break-all', fontFamily: row.mono ? 'monospace' : 'inherit' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <button onClick={onClose} style={{
        width: '100%', padding: '9px 0', borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
        color: '#888', cursor: 'pointer', fontSize: 13,
      }}>Close</button>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [activeShifts, setActiveShifts] = useState<Shift[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [modal, setModal] = useState<'open' | 'close' | 'details' | null>(null);
  const [tab, setTab] = useState<'all' | 'active'>('all');

  async function loadData() {
    setLoading(true);
    try {
      const [listRes, activeRes] = await Promise.all([
        shiftsApi.getAll(page, 10, statusFilter || undefined),
        shiftsApi.getActive(),
      ]);
      setShifts(listRes.data);
      setTotalPages(listRes.meta.totalPages);
      setActiveShifts(activeRes);
      try {
        const cur = await shiftsApi.current();
        setCurrentShift(cur);
      } catch {
        setCurrentShift(null);
      }
    } catch (e) {
      console.error('Failed to load shifts:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [page, statusFilter]);

  function onSuccess() {
    setModal(null);
    setSelectedShift(null);
    loadData();
  }

  const filterMap: Record<string, string> = { All: '', Open: 'open', Closed: 'closed' };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0e0d', color: '#e8e0d0',
      fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif",
    }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: '#0f0e0d',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 28px',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: '#e8e0d0', letterSpacing: '-0.01em' }}>Shifts</h1>
          <p style={{ margin: 0, fontSize: 12, color: '#555', marginTop: 2 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {currentShift && (
            <button onClick={() => setModal('close')} style={{
              padding: '7px 14px', borderRadius: 999, border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.08)', color: '#f87171',
              cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171', boxShadow: '0 0 6px #f87171' }} />
              Close My Shift
            </button>
          )}
          <button onClick={() => setModal('open')} style={{
            padding: '8px 18px', borderRadius: 999,
            background: '#c9a84c', color: '#111',
            border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13,
          }}>+ Open Shift</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 28px' }}>

        {/* Active shift banner */}
        {currentShift && (
          <div style={{
            background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9a84c', boxShadow: '0 0 8px #c9a84c', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, color: '#c9a84c' }}>Your shift is active</p>
                <p style={{ margin: 0, fontSize: 11, color: '#666' }}>Started {formatDate(currentShift.opened_at)} · {duration(currentShift.opened_at)} elapsed</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Opening Cash</p>
              <p style={{ margin: 0, fontSize: 14, color: '#c9a84c', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(currentShift.opening_cash)}</p>
            </div>
          </div>
        )}

        {/* Main card */}
        <div style={{
          background: '#161410', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: '#e8e0d0' }}>
                {tab === 'active' ? 'Active Shifts' : 'All Shifts'}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
                {tab === 'active' ? `${activeShifts.length} cashiers currently on shift` : 'Latest activity'}
              </p>
            </div>

            {/* Tab pills */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {(['All', 'Open', 'Closed'] as const).map(t => {
                const isActive = statusFilter === filterMap[t] && (t === 'All' ? tab === 'all' : true);
                return (
                  <button key={t} onClick={() => {
                    if (t === 'All') { setTab('all'); setStatusFilter(''); }
                    else if (t === 'Open') { setTab('active'); setStatusFilter('open'); }
                    else { setTab('all'); setStatusFilter('closed'); }
                    setPage(1);
                  }} style={{
                    padding: '4px 12px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
                    border: '1px solid',
                    borderColor: (statusFilter === filterMap[t] && tab === (t === 'Open' ? 'active' : 'all'))
                      ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)',
                    background: (statusFilter === filterMap[t] && tab === (t === 'Open' ? 'active' : 'all'))
                      ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: (statusFilter === filterMap[t] && tab === (t === 'Open' ? 'active' : 'all'))
                      ? '#c9a84c' : '#666',
                  }}>{t}</button>
                );
              })}
            </div>
          </div>

          {/* Active cards view */}
          {tab === 'active' && (
            <div style={{ padding: 20 }}>
              {activeShifts.length === 0 && (
                <p style={{ textAlign: 'center', color: '#444', padding: '40px 0', fontSize: 13 }}>No active shifts right now</p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                {activeShifts.map(shift => (
                  <div key={shift.id} onClick={() => { setSelectedShift(shift); setModal('details'); }}
                    style={{
                      background: '#111', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10, padding: 14, cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'rgba(201,168,76,0.12)', color: '#c9a84c',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11,
                      }}>{shift.user?.name?.charAt(0) ?? '?'}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, color: '#e8e0d0' }}>{shift.user?.name ?? '—'}</p>
                        <p style={{ margin: 0, fontSize: 10, color: '#555' }}>{shift.user?.email}</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <div style={{ background: '#0f0e0d', borderRadius: 6, padding: '7px 9px' }}>
                        <p style={{ margin: 0, fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Opening</p>
                        <p style={{ margin: 0, fontSize: 13, color: '#c9a84c', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(shift.opening_cash)}</p>
                      </div>
                      <div style={{ background: '#0f0e0d', borderRadius: 6, padding: '7px 9px' }}>
                        <p style={{ margin: 0, fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Duration</p>
                        <p style={{ margin: 0, fontSize: 13, color: '#aaa' }}>{duration(shift.opened_at)}</p>
                      </div>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: 10, color: '#444' }}>{timeAgo(shift.opened_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table view */}
          {tab === 'all' && (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['SHIFT ID', 'CASHIER', 'STATUS', 'OPENING CASH', 'CLOSING CASH', 'DIFFERENCE', 'TIME', 'ACTIONS'].map(h => (
                      <th key={h} style={{
                        padding: '10px 20px', textAlign: 'left',
                        fontSize: 10, color: '#444', fontWeight: 500,
                        letterSpacing: '0.06em', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#444', fontSize: 13 }}>Loading…</td></tr>
                  )}
                  {!loading && shifts.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#444', fontSize: 13 }}>No shifts found</td></tr>
                  )}
                  {!loading && shifts.map((shift, i) => {
                    const diff = shift.closing_cash != null ? shift.closing_cash - shift.opening_cash : null;
                    return (
                      <tr key={shift.id} style={{
                        borderBottom: i < shifts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: '#c9a84c', fontVariantNumeric: 'tabular-nums' }}>
                          #{shift.id.slice(0, 6).toUpperCase()}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: '50%',
                              background: 'rgba(201,168,76,0.1)', color: '#c9a84c',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10, flexShrink: 0,
                            }}>{shift.user?.name?.charAt(0) ?? '?'}</div>
                            <div>
                              <p style={{ margin: 0, fontSize: 13, color: '#e8e0d0' }}>{shift.user?.name ?? '—'}</p>
                              <p style={{ margin: 0, fontSize: 10, color: '#555' }}>{shift.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}><StatusBadge status={shift.status} /></td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: '#aaa', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(shift.opening_cash)}</td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: '#aaa', fontVariantNumeric: 'tabular-nums' }}>
                          {shift.closing_cash != null ? formatCurrency(shift.closing_cash) : <span style={{ color: '#333' }}>—</span>}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                          {diff != null
                            ? <span style={{ color: diff >= 0 ? '#4ade80' : '#f87171' }}>{diff >= 0 ? '+' : ''}{formatCurrency(diff)}</span>
                            : <span style={{ color: '#333' }}>—</span>}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 12, color: '#555', whiteSpace: 'nowrap' }}>{timeAgo(shift.opened_at)}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <button onClick={() => { setSelectedShift(shift); setModal('details'); }}
                            style={{
                              padding: '5px 12px', borderRadius: 6,
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'transparent', color: '#666',
                              cursor: 'pointer', fontSize: 11,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.color = '#c9a84c'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#666'; }}>
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)',
              }}>
                <p style={{ margin: 0, fontSize: 11, color: '#444' }}>
                  Showing {shifts.length} shift{shifts.length !== 1 ? 's' : ''}
                </p>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{
                      padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent', color: page === 1 ? '#333' : '#666',
                      cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 11,
                    }}>Previous</button>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{
                      padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent', color: page === totalPages ? '#333' : '#666',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 11,
                    }}>Next</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === 'open' && <OpenShiftModal onClose={() => setModal(null)} onSuccess={onSuccess} />}
      {modal === 'close' && currentShift && <CloseShiftModal shift={currentShift} onClose={() => setModal(null)} onSuccess={onSuccess} />}
      {modal === 'details' && selectedShift && <ShiftDetailsModal shift={selectedShift} onClose={() => { setModal(null); setSelectedShift(null); }} />}
    </div>
  );
}
