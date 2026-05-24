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
