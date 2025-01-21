'use client'

import CartItem from '@/components/cart-item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react';
import React from 'react'

const CartPage = () => {
  const { cart } = useCart();
  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum: any, item: any) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cart</h1>
          <p className="text-sm text-muted-foreground">
            Daftar semua item di keranjang.
          </p>
        </div>
        <Separator />
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Shopping Cart</h3>
            <Badge variant="secondary">
              {totalItems} items
            </Badge>
          </div>
          <div className="pr-4">
            {
              cart.length > 0
                ? 
                cart.map((item: any) => (
                <React.Fragment key={item.id}>
                  <CartItem item={item} />
                  <Separator />
                </React.Fragment>
              ))
              : <div className="flex flex-col items-center justify-center h-52 gap-y-4">
                  <ShoppingCart size={40} />
                  <span className="text-sm text-slate-400">No data available</span>
                </div>
            }
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString()}</span>
            </div>
            <div className="space-y-2">
              <Button className="w-full">
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage