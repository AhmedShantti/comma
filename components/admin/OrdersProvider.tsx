'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '../AuthProvider';
import type { Order, OrderStatus } from '@/lib/types';

// ── Backend → frontend order shape mapper ───────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function mapBackendOrder(o: any): Order {
  const nonVoidedItems = (o.items || []).filter((i: any) => !i.is_voided);

  const itemsEn = nonVoidedItems.length
    ? nonVoidedItems
        .map((i: any) => `${i.item_name_en}${i.quantity > 1 ? ` x${i.quantity}` : ''}`)
        .join(', ')
    : '—';
  const itemsAr = nonVoidedItems.length
    ? nonVoidedItems
        .map((i: any) => `${i.item_name_ar}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`)
        .join(', ')
    : '—';

  const status = ((o.status as string) || 'open').toLowerCase() as OrderStatus;

  return {
    id: o.id,                              // ✅ real DB id — used for API calls
    orderNumber: o.order_number || o.id,   // ✅ display label — shown in UI
    cust: {
      en: o.customer_name || 'Guest',
      ar: o.customer_name || 'ضيف',
    },
    table: o.table_number || '—',
    items: { en: itemsEn, ar: itemsAr },
    total: Number(o.total) || 0,
    status,
    statusKey: status as any,
    time: o.created_at ? formatRelativeTime(o.created_at) : '—',
  };
}

// ── Context ──────────────────────────────────────────────────────────────────

type Ctx = {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (data: any) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  deleteOrder: (id: string, reason?: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
};

const OrdersCtx = createContext<Ctx | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.orders.getAll();
      const ordersArr = Array.isArray(result) ? result : (result?.data ?? []);
      setOrders(ordersArr.map(mapBackendOrder));
      setError(null);
    } catch (err: any) {
      if (err?.message?.includes('401') || err?.status === 401) {
        await logout();
        return;
      }
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshOrders();
    const interval = setInterval(refreshOrders, 10_000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const createOrder = useCallback(
    async (data: any) => {
      try {
        await api.orders.create(data);
        await refreshOrders();
      } catch (err: any) {
        if (err?.message?.includes('401') || err?.status === 401) {
          await logout();
          return;
        }
        throw err;
      }
    },
    [refreshOrders, logout],
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await api.orders.updateStatus(id, status);
        await refreshOrders();
      } catch (err: any) {
        if (err?.message?.includes('401') || err?.status === 401) {
          await logout();
          return;
        }
        throw err;
      }
    },
    [refreshOrders, logout],
  );

  const deleteOrder = useCallback(
    async (id: string, reason = 'Cancelled by manager') => {
      try {
        await api.orders.delete(id, reason);
        await refreshOrders();
      } catch (err: any) {
        if (err?.message?.includes('401') || err?.status === 401) {
          await logout();
          return;
        }
        throw err;
      }
    },
    [refreshOrders, logout],
  );

  return (
    <OrdersCtx.Provider
      value={{ orders, loading, error, createOrder, updateOrderStatus, deleteOrder, refreshOrders }}
    >
      {children}
    </OrdersCtx.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersCtx);
  if (!ctx) throw new Error('useOrders must be used inside <OrdersProvider>');
  return ctx;
}