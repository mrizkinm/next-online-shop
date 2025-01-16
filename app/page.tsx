import CategoryItem from "@/components/category-item";
import FeaturedProducts from "@/components/featured-products";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories, getProducts } from "@/lib/api";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function Home() {
  const { data: products, total } = await getProducts({
    isFeatured: true
  });

  const categories = await getCategories({limit: 3});

  return (
    <div>
      {/* Hero Section */}
      <div className="h-[60vh] bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Style
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Shop the latest trends in fashion, electronics, and more with our curated collection of premium products.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-12 space-y-16">
        {/* Categories */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/categories" className={cn(buttonVariants({ variant: "ghost" }), "group")}>
              View All 
              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Suspense fallback={<CategorySkeleton />}>
              <CategoryItem categories={categories} />
            </Suspense>
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products" className={cn(buttonVariants({ variant: "ghost" }), "group")}>
              View All 
              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Suspense fallback={<FeaturedProductsSkeleton />}>
              <FeaturedProducts products={products} />
            </Suspense>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for updates on new products, special offers, and more.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const CategorySkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="group relative cursor-pointer">
          <div className="aspect-[2/1] overflow-hidden rounded-lg">
            <Skeleton className="w-full h-full bg-gray-200" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
              <Skeleton className="w-32 h-6 bg-gray-300 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};


const FeaturedProductsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-gray-200 animate-pulse rounded-lg">
          <div className="aspect-square" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-1/3 bg-gray-300 rounded" />
            <div className="h-6 w-2/3 bg-gray-300 rounded" />
            <div className="h-4 w-1/4 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </>
  )
}