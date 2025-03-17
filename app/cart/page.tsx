'use client'

import CartItem from '@/components/cart-item';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/store/cart-store';
import { useNumberFormat } from '@/hooks/use-number-format';
import { cn } from '@/lib/utils';
import { CreditCard, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { Cart } from '../types';

const CartPage = () => {
  const { cart } = useCart();
  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum: number, item: Cart) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cart</h1>
          <p className="text-sm text-muted-foreground">
            List all items in the cart.
          </p>
        </div>
        <Separator />
        <div className="space-y-6">
          <Card>
            <CardContent>
              <CardHeader className="px-0">
                <CardTitle>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Shopping Cart</h3>
                    <Badge variant="secondary">
                      {totalItems} items
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <div className="pr-4">
                {
                  cart.length > 0
                  ? cart.map((item: Cart) => (
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
                  <span>Rp {useNumberFormat(totalPrice) }</span>
                </div>
                <div className="space-y-2 justify-">
                  <div className="flex justify-end">
                    <Link href="/checkout" className={cn(buttonVariants({ variant: "default" }))}>
                      <CreditCard />
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartPage