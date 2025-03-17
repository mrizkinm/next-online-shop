'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useImageFallbacks } from '@/hooks/use-image-fallbacks';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Product } from '@/app/types';
import { useNumberFormat } from '@/hooks/use-number-format';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({products}) => {
  const { getSrc, handleImageError } = useImageFallbacks();

  return (
    <>
     {products.map((product: Product) => {
      const formattedPrice = useNumberFormat(product.price);
        return (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={getSrc(product.id, `${product.images?.[0].url}`)}
                    alt={product.name}
                    fill
                    sizes="100vw"
                    className="object-cover rounded-t-lg"
                    onError={() => handleImageError(product.id)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 p-4">
                <Badge variant="secondary">{product.category?.name}</Badge>
                <h3 className="font-semibold tracking-tight">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Rp {formattedPrice}
                </p>
                {product.quantity === 0 && (
                  <Badge variant="destructive">Stok Habis</Badge>
                )}
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </>
  );
};

export default FeaturedProducts