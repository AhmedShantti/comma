import { Shift, ListResponse } from '@/components/dashboard/shifts/types';

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '');

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
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

export const shiftsApi = {
  getAll: (page: number = 1, limit: number = 10, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return apiFetch<ListResponse<Shift>>(`/api/v1/shifts?${params}`);
  },

  current: () => apiFetch<Shift>('/api/v1/shifts/current'),

  getActive: () => apiFetch<Shift[]>('/api/v1/shifts/active'),

  getById: (id: string) => apiFetch<Shift>(`/api/v1/shifts/${id}`),

  create: (openingCash: number) =>
    apiFetch<Shift>('/api/v1/shifts/open', {
      method: 'POST',
      body: JSON.stringify({ opening_cash: openingCash }),
    }),

  close: (closingCash: number, notes?: string) =>
    apiFetch<Shift>('/api/v1/shifts/close', {
      method: 'POST',
      body: JSON.stringify({ closing_cash: closingCash, notes: notes || undefined }),
    }),
};
