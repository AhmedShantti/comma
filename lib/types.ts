import type { Localized, UIKey } from './i18n';

export type CategorySlug =
  | 'coffees'
  | 'hot-drinks'
  | 'cold-drinks'
  | 'fresh-juices'
  | 'smoothies'
  | 'desserts'
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

export type OrderStatus = 'Completed' | 'Preparing' | 'Pending' | 'Cancelled';

export type StatusDatum = {
  status: OrderStatus;
  statusKey: UIKey;
  count: number;
  color: string;
  cls: string;
};

export type Order = {
  id: string;
  cust: Localized;
  table: string;
  items: Localized;
  total: number;
  status: OrderStatus;
  statusKey: UIKey;
  time: string;
};
