import { useState, useCallback, useMemo } from 'react';

export interface CartItem {
  menuItemId: string;
  name: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  addons: { id: string; name: string; price: number }[];
  notes?: string;
}

interface UseCartReturn {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, variantId?: string) => void;
  updateQuantity: (menuItemId: string, qty: number, variantId?: string) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        i => i.menuItemId === item.menuItemId && i.variantId === item.variantId,
      );

      if (existingItemIndex >= 0) {
        // Merge with existing item (increase quantity)
        const updated = [...prevItems];
        updated[existingItemIndex].quantity += item.quantity;
        return updated;
      }

      // Add new item
      return [...prevItems, item];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string, variantId?: string) => {
    setItems(prevItems =>
      prevItems.filter(i => !(i.menuItemId === menuItemId && i.variantId === variantId)),
    );
  }, []);

  const updateQuantity = useCallback(
    (menuItemId: string, qty: number, variantId?: string) => {
      if (qty <= 0) {
        removeItem(menuItemId, variantId);
        return;
      }

      setItems(prevItems =>
        prevItems.map(i =>
          i.menuItemId === menuItemId && i.variantId === variantId ? { ...i, quantity: qty } : i,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const { totalAmount, totalItems } = useMemo(() => {
    let total = 0;
    let count = 0;

    for (const item of items) {
      const itemPrice = (item.unitPrice + item.addons.reduce((sum, a) => sum + a.price, 0)) * item.quantity;
      total += itemPrice;
      count += item.quantity;
    }

    return { totalAmount: total, totalItems: count };
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems,
  };
}
