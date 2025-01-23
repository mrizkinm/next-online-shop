'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image';
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MinusCircle, 
  PlusCircle, 
  ShoppingCart 
} from 'lucide-react';
import { useImageFallbacks } from '@/hooks/use-image-fallbacks';
import { useCart } from '@/context/cart-context';
import { Image as ProductImage, Product } from '@/app/types';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useUserData } from '@/context/user-data-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({product}) => {
  const [quantity, setQuantity] = useState(1);
  const publicUrl = process.env.NEXT_PUBLIC_API_URL_PUBLIC;
  const { getSrc, handleError } = useImageFallbacks();
  const { addToCart } = useCart();
  const swiperRef = useRef<any>(null);
  const { user } = useUserData();
  const customerId = user?.id;

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (product) {
      if (action === 'increase' && quantity < product.quantity) {
        setQuantity(prev => prev + 1);
      } else if (action === 'decrease' && quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    }
  };

  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4 md:col-span-1 lg:col-span-1">
         {/* Swiper for Main Image */}
          <Swiper
            className="relative aspect-square rounded-lg overflow-hidden"
            onSwiper={(swiper) => {
              swiperRef.current = swiper; // Set Swiper instance
            }}
          >
            {product.images.map((image: ProductImage, index: number) => (
              <SwiperSlide key={image.id}>
                <Image
                  src={getSrc(image.id, `${publicUrl}/${image.url}`
                  )}
                  alt={product.name}
                  title={product.name}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => handleError(image.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image: ProductImage, index: number) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-black"
                onClick={() => swiperRef.current?.slideTo(index)} // Control the Swiper slide
              >
                <Image
                  src={getSrc(image.id, `${publicUrl}/${image.url}`)}
                  alt={`${product.name} Thumbnail ${index + 1}`}
                  title={`${product.name} Thumbnail ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => handleError(image.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 md:col-span-1 lg:col-span-2">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge>{product.category.name}</Badge>
              {product.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold mt-2">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Deskripsi</TabsTrigger>
              <TabsTrigger value="details">Detail Produk</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <dl className="divide-y">
                <div className="py-2 flex justify-between">
                  <dt className="font-medium">Kategori</dt>
                  <dd className="text-gray-600">{product.category.name}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="font-medium">Stok</dt>
                  <dd className="text-gray-600">{product.quantity}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="font-medium">Status</dt>
                  <dd className="text-gray-600">
                    {product.quantity > 0 ? 'Tersedia' : 'Stok Habis'}
                  </dd>
                </div>
              </dl>
            </TabsContent>
          </Tabs>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Jumlah</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= product.quantity}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                {
                  user
                  ? <Button
                      title="Add to Cart"
                      className="w-full" 
                      disabled={product.quantity === 0}
                      onClick={() => addToCart(customerId, product.id, quantity)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.quantity === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </Button>
                  : <Link
                      href="/login"
                      title="Add to Cart"
                      className={cn(buttonVariants({ variant: "default" }), "w-full")}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.quantity === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </Link>
                }
                
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-500">
            Terakhir diupdate: {new Date(product.updatedAt).toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail