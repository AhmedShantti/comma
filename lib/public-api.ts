const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

async function request(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = Array.isArray(error.message)
      ? error.message[0]
      : error.message || `HTTP ${response.status}`;
    throw new Error(msg);
  }

  const json = await response.json();
  return json?.data !== undefined ? json.data : json;
}

export const publicApi = {
  // ================= PUBLIC TABLES =================
  tables: {
    getById: (id: string) =>
      request(`/api/v1/public/tables/${id}`),
  },

  // ================= PUBLIC MENU ITEMS =================
  menuItems: {
    getById: (id: string) =>
      request(`/api/v1/menu-items/${id}`),

    getAll: (qs?: string) =>
      request(`/api/v1/menu-items${qs ? `?${qs}` : ''}`),
  },

  // ================= PUBLIC ADDONS =================
  addons: {
    getAll: () =>
      request(`/api/v1/addons?is_active=true`),
  },

  // ================= PUBLIC ORDERS =================
  orders: {
    create: (data: any) =>
      request("/api/v1/public/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
