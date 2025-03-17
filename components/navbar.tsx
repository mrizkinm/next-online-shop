'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from './ui/button';
import { Menu } from 'lucide-react';
import CartDropdown from './cart-dropdown';
import { useStore } from "@/store/shop-store";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ThemeButton from './theme-button';
import UserDropdown from './user-dropdown';
import { useSession } from 'next-auth/react';
import SearchDropdown from './search-dropdown';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

const Navbar = () => {
  const { storeInfo, loading } = useStore();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-950 border-b z-50">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Bar - Logo, Search, and Cart */}
        <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          {loading ? (
            <Skeleton className="w-[150px] h-[40px] rounded-md" />
          ) : storeInfo?.image ? (
            <Link href="/">
              <Image src={storeInfo.image} alt={storeInfo.name || "Store"} width={150} height={50} className="rounded-md" />
            </Link>
          ) : (
            <Link href="/">
              <Skeleton className="w-[150px] h-[40px] bg-gray-200 rounded-md" />
            </Link>
          )}
          </div>
          <div className="hidden md:block relative max-w-sm lg:max-w-lg w-full">
           <SearchDropdown />
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <ThemeButton />
            </div>
            <CartDropdown />
            <UserDropdown />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Browse our categories and more
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  <div className="pt-4 pl-3">
                    <ThemeButton />
                  </div>
                  <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>Home</Link>
                  <Link href="/products" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>Products</Link>
                  <Link href="/categories" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>Categories</Link>
                  <Link href="/cart" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>Cart</Link>
                  {
                    user && <Link href="/account" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start")}>Account</Link>
                  }
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* Desktop Navigation Menu */}
      <div className="bg-white dark:bg-gray-950 border-t">
        <div className="md:hidden p-2">
          <SearchDropdown />
        </div>
        <div className="hidden md:flex justify-center items-center space-x-8 p-2">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>Home</Link>
          <Link href="/products" className={cn(buttonVariants({ variant: "ghost" }))}>Products</Link>
          <Link href="/categories" className={cn(buttonVariants({ variant: "ghost" }))}>Categories</Link>
          <Link href="/cart" className={cn(buttonVariants({ variant: "ghost" }))}>Cart</Link>
          {
            user && <Link href="/account" className={cn(buttonVariants({ variant: "ghost" }))}>Account</Link>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar