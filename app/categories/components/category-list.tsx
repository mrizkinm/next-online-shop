'use client';

import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';
import { useImageFallbacks } from '@/hooks/use-image-fallbacks';
import { Category } from '@/app/types';

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({categories}) => {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL_PUBLIC;
  const { getSrc, handleError } = useImageFallbacks();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/products?categoryId=${category.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative w-full h-40">
                  <Image
                    src={getSrc(category.id, `${publicUrl}/${category.image}`)}
                    alt={category.name}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="100vw"
                    onError={() => handleError(category.id)}
                  />
                </div>
                <CardFooter className="flex flex-col items-start gap-2 p-4">
                  <h2 className="text-lg font-bold">{category.name}</h2>
                  <p>Products: {category.products?.length}</p>
                </CardFooter>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryList