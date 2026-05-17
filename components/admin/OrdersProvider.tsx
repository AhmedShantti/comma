'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ORDERS as SEED_ORDERS } from '@/lib/data';
import type { Order } from '@/lib/types';

type Ctx = {
  orders: Order[];
  addOrder: (o: Order) => void;
  nextId: () => string;
};

const OrdersCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = 'comma_orders';

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Order[];
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
      } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  const addOrder = useCallback((o: Order) => {
    setOrders((prev) => [o, ...prev]);
  }, []);

  const nextId = useCallback(() => {
    const nums = orders
      .map((o) => parseInt(o.id.replace(/[^\d]/g, ''), 10))
      .filter((n) => !Number.isNaN(n));
    const max = nums.length > 0 ? Math.max(...nums) : 1024;
    return `#ORD-${max + 1}`;
  }, [orders]);

  return (
    <OrdersCtx.Provider value={{ orders, addOrder, nextId }}>{children}</OrdersCtx.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersCtx);
  if (!ctx) throw new Error('useOrders must be used inside <OrdersProvider>');
  return ctx;
}
