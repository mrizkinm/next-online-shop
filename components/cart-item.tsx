'use client'

import React from 'react'
import { Button } from './ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useImageFallbacks } from '@/hooks/use-image-fallbacks';
import { useCart } from "@/context/cart-context";
import Link from 'next/link';
import { Cart } from '@/app/types';
import { useSession } from 'next-auth/react';
import { useNumberFormat } from '@/hooks/use-number-format';

interface CartItemProps {
  item: Cart;
}

const CartItem: React.FC<CartItemProps> = ({item}) => {
  const { addToCart, removeFromCart } = useCart();
  const { getSrc, handleError } = useImageFallbacks();
  const publicUrl = process.env.NEXT_PUBLIC_API_URL_PUBLIC;
  const imageUrl = `${publicUrl}/${item.product.images?.[0].url}`;
  const { data: session } = useSession();
  const user = session?.user;
  const customerId = user?.id;

  return (
    <div className="flex items-center py-4">
      <div className="w-16 h-16 relative rounded overflow-hidden">
        <Link href={`/products/${item.productId}`}>
        <img
          src={getSrc(item.id, imageUrl)}
          alt={item.product.name}
          className="object-cover w-full h-full"
          onError={() => handleError(item.id)}
        />
        </Link>
      </div>
      <div className="ml-4 flex-1">
        <Link href={`/products/${item.productId}`} className="font-medium text-sm">{item.product.name}</Link>
        <p className="text-gray-500 text-sm">Rp { useNumberFormat(item.product.price) }</p>
        <div className="flex items-center mt-1 space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => addToCart(customerId, item.productId, -1)} // Kurangi kuantitas
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => addToCart(customerId, item.productId, 1)}
            disabled={item.quantity >= item.product.quantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        title="Remove Item"
        size="icon"
        className="text-red-500"
        onClick={() => removeFromCart(customerId, item.productId)} // Hapus item dari keranjang
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
};

export default CartItem