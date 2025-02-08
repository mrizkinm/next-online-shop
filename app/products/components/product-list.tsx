'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import debounce from 'lodash/debounce';
import { Category, Product } from '@/app/types';
import { useImageFallbacks } from '@/hooks/use-image-fallbacks';
import { useNumberFormat } from '@/hooks/use-number-format';
// import CategoryCombobox from './category-combobox';
// import { SelectGroup } from '@radix-ui/react-select';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  total: number;
  currentPage: number;
  pageSize: number;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  total,
  currentPage,
  pageSize,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const publicUrl = process.env.NEXT_PUBLIC_API_URL_PUBLIC;
  const { getSrc, handleError } = useImageFallbacks();
  
  const totalPages = Math.ceil(total / pageSize);

  const updateQuery = (params: Record<string, string | undefined>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    
    // Reset page when filtering
    if (!params.page) {
      current.delete('page');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`/products${query}`);
  };

  const handleSearch = debounce((term: string) => {
    updateQuery({ search: term || undefined });
  }, 500);

  const handleCategoryChange = (categoryId: string) => {
    console.log(categoryId);
    updateQuery({ categoryId: categoryId === 'all' ? undefined : categoryId });
  };

  const handlePageChange = (page: number) => {
    updateQuery({ page: page.toString() });
  };

  // const [searchQuery, setSearchQuery] = useState("");
  
  // const filteredCategories = categories.filter((category: any) =>
  //   category.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Search Products..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search') || ''}
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          {/* <CategoryCombobox className="w-full" categories={categories} params={searchParams.get('categoryId')} handleCategoryChange={handleCategoryChange} /> */}
          <Select
            onValueChange={handleCategoryChange}
            defaultValue={searchParams.get('categoryId') || 'all'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={getSrc(product.id, `${publicUrl}/${product.images?.[0].url}`)}
                      alt={product.name}
                      fill
                      sizes="100vw"
                      className="object-cover rounded-t-lg"
                      onError={() => handleError(product.id)}
                    />
                    {product.isFeatured && (
                      <Badge className="absolute top-2 right-2">
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 p-4">
                  <Badge variant="secondary">{product.category?.name}</Badge>
                  <h3 className="font-semibold tracking-tight">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Rp { useNumberFormat(product.price) }
                  </p>
                  {product.quantity === 0 && (
                    <Badge variant="destructive">Out of stock</Badge>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="h-[50vh] col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-500">Product not found</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
                // disabled={currentPage === 1}
              />
            </PaginationItem>
          )}
          {totalPages > 1 && (
            [...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          )}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                // disabled={currentPage === totalPages}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductList