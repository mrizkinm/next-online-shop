'use client'

import CategorySection from "@/components/category-section";
import FeaturedProducts from "@/components/featured-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ChevronRight } from "lucide-react";

export default async function Home() {
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
            <Button variant="ghost" className="group">
              View All 
              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <CategorySection />
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="ghost" className="group">
              View All 
              <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <FeaturedProducts />
        </section>

        {/* Newsletter */}
        <section className="bg-gray-100 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6">
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
