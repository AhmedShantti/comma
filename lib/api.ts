const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

async function request(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("comma_access_token")
      : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    // Backend wraps errors as { message: string } or { message: string[] }
    const msg = Array.isArray(error.message)
      ? error.message[0]
      : error.message || `HTTP ${response.status}`;
    throw new Error(msg);
  }

  const json = await response.json();
  // Unwrap the TransformInterceptor envelope: { success, data, ... } → data
  return json?.data !== undefined ? json.data : json;
}

export const api = {

  // ================= HEALTH =================
  health: () => request("/api/v1/health"),

  // ================= AUTH =================
  auth: {
    login: (data: any) =>
      request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    refresh: () => {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("comma_refresh_token")
          : null;
      return request("/api/v1/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    },

    logout: () => {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("comma_refresh_token")
          : null;
      return request("/api/v1/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    },

    me: () => request("/api/v1/auth/me"),
  },

  // ================= USERS =================
  users: {
    getAll: () => request("/api/v1/users"),

    getById: (id: string) =>
      request(`/api/v1/users/${id}`),
 
    create: (data: any) =>
      request("/api/v1/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request(`/api/v1/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request(`/api/v1/users/${id}`, {
        method: "DELETE",
      }),
  },

  // ================= SHIFTS =================
  shifts: {
    getAll: () => request("/api/v1/shifts"),

    current: () =>
      request("/api/v1/shifts/current"),

    getById: (id: string) =>
      request(`/api/v1/shifts/${id}`),

    create: (data: any) =>
      request("/api/v1/shifts/open", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    close: () =>
      request("/api/v1/shifts/close", {
        method: "POST",
      }),
  },

  // ================= CATEGORIES =================
  categories: {
    getAll: (qs?: string) => request(`/api/v1/categories${qs ? `?${qs}` : ''}`),

    getById: (id: string) =>
      request(`/api/v1/categories/${id}`),

    create: (data: any) =>
      request("/api/v1/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request(`/api/v1/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request(`/api/v1/categories/${id}`, {
        method: "DELETE",
      }),
  },

  // ================= MENU ITEMS =================
  menuItems: {
    getAll: (qs?: string) => request(`/api/v1/menu-items${qs ? `?${qs}` : ''}`),

    getById: (id: string) =>
      request(`/api/v1/menu-items/${id}`),

    create: (data: any) =>
      request("/api/v1/menu-items", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request(`/api/v1/menu-items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request(`/api/v1/menu-items/${id}`, {
        method: "DELETE",
      }),

    availability: () =>
      request("/api/v1/menu-items/availability"),

    setAddons: (id: string, addonIds: string[]) =>
      request(`/api/v1/menu-items/${id}/addons`, {
        method: "PATCH",
        body: JSON.stringify({ addon_ids: addonIds }),
      }),

    addAddon: (id: string, addonId: string) =>
      request(`/api/v1/menu-items/${id}/addons/${addonId}`, {
        method: "POST",
      }),

    removeAddon: (id: string, addonId: string) =>
      request(`/api/v1/menu-items/${id}/addons/${addonId}`, {
        method: "DELETE",
      }),
  },

  // ================= ADDONS =================
  addons: {
    getAll: () => request("/api/v1/addons"),

    create: (data: any) =>
      request("/api/v1/addons", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request(`/api/v1/addons/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request(`/api/v1/addons/${id}`, {
        method: "DELETE",
      }),
  },

  // ================= ORDERS =================
  orders: {
    getAll: () => request("/api/v1/orders"),

    getById: (id: string) =>
      request(`/api/v1/orders/${id}`),

    create: (data: any) =>
      request("/api/v1/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    updateStatus: (
      id: string,
      status: string
    ) =>
      request(`/api/v1/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    delete: (id: string, reason: string = "Cancelled by manager") =>
      request(`/api/v1/orders/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ reason }),
      }),

    processPayment: (id: string, data: any) =>
      request(`/api/v1/orders/${id}/pay`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getActiveTableOrder: (tableId: string) =>
      request(`/api/v1/orders/table/${tableId}/active`),

    openOrCreateTableOrder: (tableId: string) =>
      request(`/api/v1/orders/table/${tableId}/open-or-create`, {
        method: "POST",
      }),

    addItems: (id: string, items: any[]) =>
      request(`/api/v1/orders/${id}/items`, {
        method: "POST",
        body: JSON.stringify({ items }),
      }),

    updateItem: (id: string, itemId: string, data: any) =>
      request(`/api/v1/orders/${id}/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    removeItem: (id: string, itemId: string) =>
      request(`/api/v1/orders/${id}/items/${itemId}`, {
        method: "DELETE",
      }),

    checkout: (id: string, data: any) =>
      request(`/api/v1/orders/${id}/checkout`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // ================= TABLES =================
  tables: {
    getAll: (qs?: string) => request(`/api/v1/tables${qs ? `?${qs}` : ''}`),

    getById: (id: string) =>
      request(`/api/v1/tables/${id}`),

    getByNumber: (number: number) =>
      request(`/api/v1/tables/number/${number}`),

    create: (data: any) =>
      request("/api/v1/tables", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request(`/api/v1/tables/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    updateStatus: (id: string, status: string) =>
      request(`/api/v1/tables/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    getOrdersHistory: (id: string, qs?: string) =>
      request(`/api/v1/tables/${id}/orders${qs ? `?${qs}` : ''}`),

    delete: (id: string) =>
      request(`/api/v1/tables/${id}`, {
        method: "DELETE",
      }),
  },

  // ================= INVOICES =================
  invoices: {
    getAll: () => request("/api/v1/invoices"),

    getById: (id: string) =>
      request(`/api/v1/invoices/${id}`),

    export: (id: string) =>
      request(`/api/v1/invoices/${id}/export`),
  },

  // ================= RECEIPTS =================
  receipts: {
    getAll: (filters?: any) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
        });
      }
      const qs = params.toString();
      return request(`/api/v1/receipts${qs ? `?${qs}` : ''}`);
    },

    getById: (id: string) =>
      request(`/api/v1/receipts/${id}`),

    getStats: () =>
      request("/api/v1/receipts/stats"),

    getTopTables: () =>
      request("/api/v1/receipts/top-tables"),

    getTopItems: () =>
      request("/api/v1/receipts/top-items"),

    reprint: (id: string) =>
      request(`/api/v1/receipts/${id}/reprint`, {
        method: "POST",
      }),
  },

  // ================= CASH DRAWER =================
  cashDrawer: {
    get: () =>
      request("/api/v1/cash-drawer"),

    cashIn: (data: { amount: number; notes?: string }) =>
      request("/api/v1/cash-drawer/cash-in", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    cashOut: (data: { amount: number; notes?: string }) =>
      request("/api/v1/cash-drawer/cash-out", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // ================= DASHBOARD =================
  dashboard: {
    stats: () => request("/api/v1/dashboard/stats"),
  },

  // ================= REPORTS =================
  reports: {
    dashboardSummary: () =>
      request("/api/v1/reports/dashboard/summary"),

    daily: (date?: string) =>
      request(`/api/v1/reports/daily${date ? `?date=${date}` : ''}`),

    dailyLatest: () =>
      request("/api/v1/reports/daily/latest"),

    dailyRange: (from?: string, to?: string) => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const qs = params.toString();
      return request(`/api/v1/reports/daily/range${qs ? `?${qs}` : ''}`);
    },

    dailyPdf: (id: string) =>
      `${API_URL}/api/v1/reports/daily/${id}/pdf`,

    generateDaily: (date?: string) =>
      request(`/api/v1/reports/generate/daily${date ? `?date=${date}` : ''}`, { method: 'POST' }),

    weekly: (week?: number, year?: number) => {
      const params = new URLSearchParams();
      if (week) params.set('week', String(week));
      if (year) params.set('year', String(year));
      const qs = params.toString();
      return request(`/api/v1/reports/weekly${qs ? `?${qs}` : ''}`);
    },

    weeklyLatest: () =>
      request("/api/v1/reports/weekly/latest"),

    weeklyRange: (from?: string, to?: string) => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const qs = params.toString();
      return request(`/api/v1/reports/weekly/range${qs ? `?${qs}` : ''}`);
    },

    weeklyPdf: (id: string) =>
      `${API_URL}/api/v1/reports/weekly/${id}/pdf`,

    generateWeekly: (week?: number, year?: number) => {
      const params = new URLSearchParams();
      if (week) params.set('week', String(week));
      if (year) params.set('year', String(year));
      const qs = params.toString();
      return request(`/api/v1/reports/generate/weekly${qs ? `?${qs}` : ''}`, { method: 'POST' });
    },

    monthly: (month?: number, year?: number) => {
      const params = new URLSearchParams();
      if (month) params.set('month', String(month));
      if (year) params.set('year', String(year));
      const qs = params.toString();
      return request(`/api/v1/reports/monthly${qs ? `?${qs}` : ''}`);
    },

    monthlyLatest: () =>
      request("/api/v1/reports/monthly/latest"),

    monthlyRange: (year?: number) =>
      request(`/api/v1/reports/monthly/range${year ? `?year=${year}` : ''}`),

    monthlyPdf: (id: string) =>
      `${API_URL}/api/v1/reports/monthly/${id}/pdf`,

    generateMonthly: (month?: number, year?: number) => {
      const params = new URLSearchParams();
      if (month) params.set('month', String(month));
      if (year) params.set('year', String(year));
      const qs = params.toString();
      return request(`/api/v1/reports/generate/monthly${qs ? `?${qs}` : ''}`, { method: 'POST' });
    },

    generateBulk: (from?: string, to?: string) => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const qs = params.toString();
      return request(`/api/v1/reports/generate/bulk${qs ? `?${qs}` : ''}`, { method: 'POST' });
    },

    logs: (type?: string, limit?: number) => {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (limit) params.set('limit', String(limit));
      const qs = params.toString();
      return request(`/api/v1/reports/logs${qs ? `?${qs}` : ''}`);
    },
  },

  // ================= SETTINGS =================
  settings: {
    get: () =>
      request("/api/v1/settings"),

    update: (data: any) =>
      request("/api/v1/settings", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
};