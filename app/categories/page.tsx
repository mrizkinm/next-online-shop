import React, { Suspense } from 'react'
import { Separator } from '@/components/ui/separator';
import { getCategories } from '@/lib/api';
import CategoryList from './components/category-list';
import CategoryListSkeleton from './components/category-list-skeleton';

const CategoriesPage = async () => {

  const categories = await getCategories({});

  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            List all categories.
          </p>
        </div>
        <Separator />
        <Suspense fallback={<CategoryListSkeleton />}>
          <CategoryList categories={categories} />
        </Suspense>
      </div>
    </div>
  )
}

export default CategoriesPage