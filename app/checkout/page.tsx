'use client'

import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import React, { use } from 'react'
import CheckoutItem from './components/checkout-item';
import CheckoutForm from './components/checkout-form';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CheckoutPage = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { cart } = useCart();
  const totalPrice = cart.reduce((sum: any, item: any) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            List all items in the cart.
          </p>
        </div>
        <Separator />
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CheckoutItem items={cart} />
            {
              !user ? <CheckoutSkeleton /> : <CheckoutForm total={totalPrice} items={cart} user={user} />
            }
            
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Name Field Skeleton */}
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Email Field Skeleton */}
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Phone Field Skeleton */}
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Address Field Skeleton */}
          <div>
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
          {/* Total Section Skeleton */}
          <div className="flex justify-between items-center pt-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
          {/* Button Skeleton */}
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default CheckoutPage