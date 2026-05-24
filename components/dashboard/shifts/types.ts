export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Shift {
  id: string;
  user_id: string;
  user: User;
  opening_cash: number;
  closing_cash?: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string;
  notes?: string;
  // ✅ New: Order summary
  total_orders: number;
  total_amount: number;
  total_items: number;
}

export interface ShiftOrder {
  id: string;
  order_number: string;
  type: string;
  status: string;
  table_number?: number;
  customer_name?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  service_charge_amount: number;
  total: number;
  cashier: User;
  completed_at: string;
  created_at: string;
}

export interface ShiftOrdersResponse {
  data: ShiftOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListResponse<T> {
  data: T[];
  meta: {
    totalPages: number;
    currentPage?: number;
    total?: number;
  };
}

export type ModalType = 'open' | 'close' | 'details' | null;
export type TabType = 'all' | 'active';
