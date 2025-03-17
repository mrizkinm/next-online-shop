'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cart } from '@/app/types';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { useImageFallbacks } from '@/hooks/use-image-fallbacks';

interface CartItemProps {
  items: Cart[];
}

const CheckoutItem: React.FC<CartItemProps> = ({items}) => {
   const { getSrc, handleImageError } = useImageFallbacks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 relative rounded overflow-hidden">
                <Image
                  src={getSrc(item.id, `${item.product.images?.[0]?.url}`)}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  onError={() => handleImageError(item.id)}
                />
              </div>
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-muted-foreground">
                  {formatCurrency(item.product.price)} x {item.quantity}
                </p>
              </div>
            </div>
            <p className="font-semibold">
              {formatCurrency(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default CheckoutItem