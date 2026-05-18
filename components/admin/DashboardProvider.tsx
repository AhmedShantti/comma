'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '../AuthProvider';

type StatCards = {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  items_sold: number;
  growth: {
    revenue_pct: number;
    orders_pct: number;
    avg_order_pct: number;
    items_sold_pct: number;
  };
};

type RevenueDay = {
  day_name: string;
  day_date: string;
  revenue: number;
};

type CategoryItem = {
  category_id: string;
  name_en: string;
  name_ar: string;
  revenue: number;
  order_count: number;
  percentage: number;
};

type MostOrderedItem = {
  menu_item_id: string;
  name_en: string;
  name_ar: string;
  quantity: number;
  revenue: number;
  percentage: number;
};

type StatusSummary = Record<string, number>;

export type DashboardData = {
  stat_cards: StatCards;
  revenue_chart: RevenueDay[];
  category_breakdown: CategoryItem[];
  most_ordered: MostOrderedItem[];
  status_summary: StatusSummary;
  generated_at: string;
};

type DashboardContextType = {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const DashboardContext = createContext<DashboardContextType>({
  data: null,
  loading: true,
  error: null,
  refresh: () => {},
});

export function useDashboardData() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.dashboard.stats();
      setData(result);
      setError(null);
    } catch (err: any) {
      if (err?.message?.includes('401')) {
        await logout();
        return;
      }
      setError('Failed to load dashboard data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <DashboardContext.Provider value={{ data, loading, error, refresh: fetchData }}>
      {children}
    </DashboardContext.Provider>
  );
}
