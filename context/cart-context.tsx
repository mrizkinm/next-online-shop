'use client'

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async (customerId: string) => {
    const res = await fetch(`/api/data/cart/${customerId}`);
    const data = await res.json();
    setCart(data);
  };

  const addToCart = async (customerId: number, productId: number, quantity: number) => {
    await fetch("/api/data/cart", {
      method: "POST",
      body: JSON.stringify({ customerId, productId, quantity }),
    });
    await fetchCart(customerId.toString());
  };

  const removeFromCart = async (customerId: string, productId: number) => {
    await fetch("/api/data/cart", {
      method: "DELETE",
      body: JSON.stringify({ customerId, productId }),
    });
    await fetchCart(customerId);
  };

  useEffect(() => {
    fetchCart('1');
  }, []);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};