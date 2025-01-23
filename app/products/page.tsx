import React, { Suspense } from 'react'
import { getCategories, getProducts } from '@/lib/api';
import ProductList from './components/product-list';
import { Separator } from "@/components/ui/separator";
import ProductListSkeleton from './components/product-list-skeleton';

interface ProductsPageProps {
  searchParams: {
    categoryId?: string;
    page?: string;
    search?: string;
  }
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 12;
  
  const { data: products, total } = await getProducts({
    categoryId: params.categoryId ? Number(params.categoryId) : undefined,
    page,
    limit,
    search: params.search,
  });

  const categories = await getCategories({});

  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produk</h1>
          <p className="text-sm text-muted-foreground">
            Daftar semua produk yang tersedia.
          </p>
        </div>
        <Separator />
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList 
            products={products}
            categories={categories}
            total={total}
            currentPage={page}
            pageSize={limit}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default ProductsPage