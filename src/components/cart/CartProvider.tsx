'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type CartItem = {
  id: string;
  name_ar: string;
  name_he?: string | null;
  name_en?: string | null;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'beitna-cart-v1';

function loadInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && typeof i.id === 'string' && typeof i.price === 'number');
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadInitialCart());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write errors
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const addItem: CartContextValue['addItem'] = (item, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
    };

    const removeItem: CartContextValue['removeItem'] = (id) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity: CartContextValue['updateQuantity'] = (id, quantity) => {
      setItems((prev) =>
        prev
          .map((i) => (i.id === id ? { ...i, quantity } : i))
          .filter((i) => i.quantity > 0)
      );
    };

    const clear: CartContextValue['clear'] = () => setItems([]);

    return { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}

