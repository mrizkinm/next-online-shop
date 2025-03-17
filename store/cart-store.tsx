'use client';

import { create } from 'zustand';
import toast from 'react-hot-toast';
import { Cart } from '@/app/types';
import { useErrorHandler } from '@/hooks/use-error-handler';

interface CartState {
  cart: Cart[];
  fetchCart: (customerId: number) => Promise<void>;
  addToCart: (token: string, customerId: number, productId: number, quantity: number) => Promise<void>;
  removeFromCart: (token: string, customerId: number, productId: number) => Promise<void>;
  removeAllCart: (token: string, customerId: number) => Promise<void>;
  resetCartSession: () => void;
}

export const useCart = create<CartState>()((set) => ({
  cart: [],
  fetchCart: async (customerId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${customerId}`);
    const data = await res.json();
    set({ cart: data });
  },
  addToCart: async (token: string, customerId: number, productId: number, quantity: number) => {
    const { handleError } = useErrorHandler();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
      method: "POST",
      body: JSON.stringify({ customerId, productId, quantity }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const responseData = await response.json();
    if (response.ok) {
      if (quantity > 0) {
        toast.success('Product has been added to cart');
      } else {
        toast.success('Product has been removed from cart');
      }
      await useCart.getState().fetchCart(customerId);
    } else {
      handleError(responseData.errors);
    }
  },
  removeFromCart: async (token: string, customerId: number, productId: number) => {
    const { handleError } = useErrorHandler();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
      method: "DELETE",
      body: JSON.stringify({ customerId, productId }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const responseData = await response.json();
    if (response.ok) {
      set((state) => ({ cart: state.cart.filter((item) => item.productId !== productId) }));
      // await useCart.getState().fetchCart(customerId);
    } else {
      handleError(responseData.errors);
    }
  },
  removeAllCart: async (token: string, customerId: number) => {
    const { handleError } = useErrorHandler();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove`, {
      method: "DELETE",
      body: JSON.stringify({ customerId }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const responseData = await response.json();
    if (response.ok) {
      set({ cart: [] });
      // await useCart.getState().fetchCart(customerId);
    } else {
      handleError(responseData.errors);
    }
  },
  resetCartSession: () => {
    set({ cart: [] });
  }
}));