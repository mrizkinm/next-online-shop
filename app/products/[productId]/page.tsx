import React, { Suspense } from 'react'
import { Product } from '@/app/types';
import { getProductDetail } from '@/lib/api';
import ProductDetail from './components/product-detail';

interface ProductPageProps {
  params: {
    productId: string;
  }
}

const ProductPage: React.FC<ProductPageProps> = async ({
  params
}) => {
  const param = await params;
  const product: Product = await getProductDetail({id: parseInt(param.productId)})

  // const product: Product = {
  //   id: 1,
  //   categoryId: 1,
  //   category: {
  //     id: 1,
  //     name: "Sepatu",
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   },
  //   name: "Sneakers Premium",
  //   price: 899000,
  //   isFeatured: true,
  //   isArchived: false,
  //   description: "Sneakers premium dengan bahan berkualitas tinggi, nyaman dipakai untuk aktivitas sehari-hari.",
  //   quantity: 50,
  //   images: [
  //     { 
  //       id: 1, 
  //       productId: 1,
  //       url: "/api/placeholder/400/400",
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     },
  //     { 
  //       id: 2, 
  //       productId: 1,
  //       url: "/api/placeholder/400/400",
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     },
  //   ],
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // };


  if (!product || product.isArchived) {
    return (
      <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full h-[50vh] py-8">
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-500">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail product={product} />
    </Suspense>
  );
}

const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="aspect-square bg-gray-200 animate-pulse rounded-lg md:col-span-1 lg:col-span-1" />
        <div className="space-y-4 md:col-span-1 lg:col-span-2">
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
          <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-1/4 bg-gray-200 animate-pulse rounded" />
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 animate-pulse rounded" />
            <div className="h-40 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage