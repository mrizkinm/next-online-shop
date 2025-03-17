'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/store/cart-store';

export default function CartInitializer() {
  const { data: session } = useSession();
  const user = session?.user;
  const { fetchCart } = useCart();

  useEffect(() => {
    if (user?.id !== undefined) {
      fetchCart(user.id);
    }
  }, [user?.id, fetchCart]);

  return null;
}