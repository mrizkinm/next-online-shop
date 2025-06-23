'use client'

import { Category } from '@/app/types';
import { useImageFallbacks } from '@/hooks/use-image-fallbacks';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface CategoryItemProps {
  categories: Category[];
}

const CategoryItem: React.FC<CategoryItemProps> = ({categories}) => {
  const { getSrc, handleImageError } = useImageFallbacks();

  return (
    <>
      {categories.map((category: Category) => {
          const imageUrl = `${category.image}`;
          
          return (
            <Link key={category.id} href={`/products?categoryId=${category.id}`}>
              <div className="group relative cursor-pointer">
                <div className="aspect-[2/1] overflow-hidden rounded-lg">
                  <Image
                    src={getSrc(category.id, imageUrl)}
                    alt={category.name}
                    width={600}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(category.id)}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
    </>
  )
}

export default CategoryItem