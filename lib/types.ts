import type { Localized, UIKey } from './i18n';
export type { Localized } from './i18n';

export type CategorySlug =
  | 'appetizers'
  | 'main-courses'
  | 'beverages'
  | 'desserts'
  | 'coffees'
  | 'hot-drinks'
  | 'cold-drinks'
  | 'fresh-juices'
  | 'smoothies'
  | 'shisha'
  | 'snacks';

export type CategoryFilter = 'all' | CategorySlug;

export type CategoryDef = {
  slug: CategoryFilter;
  labelKey: UIKey;
};

export type MenuItem = {
  id: string;
  cat: CategorySlug;
  price: number;
  popular: boolean;
  img: string;
  name: Localized;
  desc: Localized;
  tags: Localized[];
};

export type Stat = {
  labelKey: UIKey;
  value: string;
  change: string;
  up: boolean;
  icon: string;
};

export type RevenuePoint = { dayKey: UIKey; v: number };
export type CatDatum = { catSlug: CategorySlug; val: number; pct: number };

export type MostOrderedItem = {
  name: Localized;
  orders: number;
  revenue: number;
  pct: number;
};

// Matches backend OrderStatus enum (lowercase)
export type OrderStatus =
  | 'open'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type StatusDatum = {
  status: OrderStatus;
  statusKey: UIKey;
  count: number;
  color: string;
  cls: string;
};

export type Order = {
  id: string;           // real DB id — used for all API calls
  orderNumber: string;  // display label — shown in UI (e.g. "ORD-42")
  cust: Localized;
  table: string;
  items: Localized;
  total: number;
  status: OrderStatus;
  statusKey: UIKey;
  time: string;
};

// ── Reports ──────────────────────────────────────────

export type DailyReport = {
  id: string;
  report_date: string;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  pending_orders: number;
  new_customers: number;
  returning_customers: number;
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  net_profit: number;
  average_order_value: number;
  top_selling_products: ProductStat[];
  payment_methods_breakdown: Record<string, number>;
  hourly_distribution: { hour: number; orders_count: number; revenue: number }[];
  created_at: string;
  updated_at: string;
};

export type WeeklyReport = {
  id: string;
  week_number: number;
  year: number;
  week_start_date: string;
  week_end_date: string;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  net_profit: number;
  average_order_value: number;
  order_growth_percentage: number;
  revenue_growth_percentage: number;
  daily_breakdown: DayBreakdown[];
  top_selling_products: ProductStat[];
  payment_methods_breakdown: Record<string, number>;
  busiest_day: string;
  created_at: string;
  updated_at: string;
};

export type MonthlyReport = {
  id: string;
  month: number;
  year: number;
  month_start_date: string;
  month_end_date: string;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  total_cost: number;
  gross_profit: number;
  net_profit: number;
  profit_margin_percentage: number;
  average_order_value: number;
  order_growth_percentage: number;
  revenue_growth_percentage: number;
  weekly_breakdown: WeekBreakdown[];
  daily_breakdown: DayBreakdown[];
  top_selling_products: ProductStat[];
  worst_selling_products: ProductStat[];
  payment_methods_breakdown: Record<string, number>;
  customer_stats: { new_customers: number; returning_customers: number; total_unique: number };
  busiest_day: string;
  slowest_day: string;
  created_at: string;
  updated_at: string;
};

export type ProductStat = {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
};

export type DayBreakdown = {
  date: string;
  orders: number;
  revenue: number;
  profit: number;
};

export type WeekBreakdown = {
  week_number: number;
  orders: number;
  revenue: number;
  profit: number;
};

export type ReportLog = {
  id: string;
  report_type: 'daily' | 'weekly' | 'monthly';
  report_id: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error_message: string | null;
  generation_time_ms: number | null;
  triggered_by: 'auto' | 'manual';
  created_at: string;
};

export type DashboardSummary = {
  daily: { date: string; total_orders: number; total_revenue: number; net_profit: number; average_order_value: number } | null;
  weekly: { week: number; year: number; total_orders: number; total_revenue: number; net_profit: number; order_growth_percentage: number; revenue_growth_percentage: number } | null;
  monthly: { month: number; year: number; total_orders: number; total_revenue: number; net_profit: number; profit_margin_percentage: number; order_growth_percentage: number; revenue_growth_percentage: number } | null;
};

export type TableStatus = 'available' | 'occupied' | 'reserved';

export type Table = {
  id: string;
  table_number: number;
  capacity: number;
  status: TableStatus;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};