"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Product } from "@/types";

export interface CartItem { product: Product; quantity: number }
interface CartContextValue {
  items: CartItem[];
  ready: boolean;
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sunday-cart") || "[]");
      if (Array.isArray(saved)) setItems(saved.filter((item) => item?.product?.id && Number.isInteger(item.quantity) && item.quantity > 0));
    } catch { /* Ignore stale local cart data. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("sunday-cart", JSON.stringify(items)); }, [items, ready]);
  const add = useCallback((product: Product) => setItems((current) => {
    const found = current.find((item) => item.product.id === product.id);
    return found ? current.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item) : [...current, { product, quantity: 1 }];
  }), []);
  const remove = useCallback((id: string) => setItems((current) => current.filter((item) => item.product.id !== id)), []);
  const setQuantity = useCallback((id: string, quantity: number) => setItems((current) => current.map((item) => item.product.id === id ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) } : item)), []);
  const clear = useCallback(() => setItems([]), []);
  return <CartContext.Provider value={{ items, ready, add, remove, setQuantity, clear }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is missing");
  return context;
}
