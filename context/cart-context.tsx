'use client'

import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext<any>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a StoreProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState([]);
  const { data: session } = useSession();
  const user = session?.user;

  const fetchCart = async (customerId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${customerId}`);
    const data = await res.json();
    setCart(data);
  };

  const addToCart = async (customerId: number, productId: number, quantity: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
      method: "POST",
      body: JSON.stringify({ customerId, productId, quantity }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.token}`
      }
    });
    toast.success('Product has been added to cart');
    await fetchCart(customerId);
  };

  const removeFromCart = async (customerId: number, productId: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
      method: "DELETE",
      body: JSON.stringify({ customerId, productId }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.token}`
      }
    });
    await fetchCart(customerId);
  };

  const removeAllCart = async (customerId: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove`, {
      method: "DELETE",
      body: JSON.stringify({ customerId }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.token}`
      }
    });
    await fetchCart(customerId);
  };

  const resetCart = () => {
    setCart([]);
    if (user?.id) {
      removeAllCart(user.id);
    }
  };

  const resetCartSession = () => {
    setCart([]);
  };

  useEffect(() => {
    if (user?.id) {
      fetchCart(user.id);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, resetCart, resetCartSession }}>
      {children}
    </CartContext.Provider>
  );
};