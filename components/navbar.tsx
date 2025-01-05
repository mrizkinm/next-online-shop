import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from './ui/button';
import { Menu, Search } from 'lucide-react';
import { Input } from './ui/input';
import CartDropdown from './cart-dropdown';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50">
      {/* Top Bar - Logo, Search, and Cart */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 border-b">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
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
                <Button variant="ghost" className="w-full justify-start">Home</Button>
                <Button variant="ghost" className="w-full justify-start">Products</Button>
                <Button variant="ghost" className="w-full justify-start">Categories</Button>
                <Button variant="ghost" className="w-full justify-start">About</Button>
                <Button variant="ghost" className="w-full justify-start">Contact</Button>
                
                <div className="pt-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search products..."
                      className="pl-8 w-full"
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold ml-4">StyleStore</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              className="pl-8"
            />
          </div>
          <CartDropdown />
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <div className="hidden md:block bg-white">
        <div className="flex justify-center items-center space-x-8 p-2">
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">Products</Button>
          <Button variant="ghost">Categories</Button>
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Contact</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar