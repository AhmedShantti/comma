const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export interface PublicOrderItem {
  menuItemId: string;
  variantId?: string;
  quantity: number;
  addons?: string[];
  notes?: string;
}

export interface PlaceCustomerOrderRequest {
  tableId: string;
  customerName?: string;
  notes?: string;
  items: PublicOrderItem[];
}

export interface PlaceCustomerOrderResponse {
  success: boolean;
  orderNumber: string;
  orderId: string;
  message: string;
}

export const publicMenuApi = {
  placeCustomerOrder: async (data: PlaceCustomerOrderRequest): Promise<PlaceCustomerOrderResponse> => {
    const res = await fetch(`${BASE_URL}/api/v1/public/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Failed to place order (${res.status})`);
    }

    return res.json();
  },
};
