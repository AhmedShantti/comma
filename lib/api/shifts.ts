import { Shift, ListResponse, ShiftOrder, ShiftOrdersResponse } from '@/components/dashboard/shifts/types';

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '');

// The NestJS backend wraps every response in an envelope via its global
// TransformInterceptor: { success, data, meta?, statusCode, timestamp }.
// These helpers unwrap that envelope so callers get the raw payload.
async function request(path: string, options?: RequestInit): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('comma_access_token') : '';
  const url = `${BASE_URL}${path}`;

  if (!token) {
    throw new Error('No authentication token found. Please log in first.');
  }

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

// Unwrap a single-payload response. Falls back to the raw body if it isn't
// wrapped in the standard envelope.
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const body = await request(path, options);
  if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
    return body.data as T;
  }
  return body as T;
}

// Unwrap a paginated list response into { data, meta }. Handles both the
// envelope shape where meta is lifted to the top level ({ data: [...], meta })
// and the un-lifted shape ({ data: { data: [...], meta } }).
async function apiFetchList<T>(path: string, options?: RequestInit): Promise<ListResponse<T>> {
  const body = await request(path, options);
  const payload = body && typeof body === 'object' && 'data' in body ? body.data : body;

  if (Array.isArray(payload)) {
    return { data: payload, meta: body?.meta ?? { totalPages: 1 } };
  }

  return {
    data: payload?.data ?? [],
    meta: payload?.meta ?? body?.meta ?? { totalPages: 1 },
  };
}

export const shiftsApi = {
  getAll: (page: number = 1, limit: number = 10, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    return apiFetchList<Shift>(`/api/v1/shifts?${params}`);
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

  // ✅ New: Get completed orders for a shift
  getShiftOrders: (shiftId: string, page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiFetchList<ShiftOrder>(`/api/v1/shifts/${shiftId}/orders?${params}`) as Promise<ShiftOrdersResponse>;
  },
};
