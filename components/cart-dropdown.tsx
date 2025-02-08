import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from './ui/button';
import { CreditCard, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import CartItem from './cart-item';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useNumberFormat } from '@/hooks/use-number-format';

const CartDropdown = () => {

  const { cart } = useCart();

  const cartItems = cart;

  // const cartItems = [
  //   { id: 1, name: "Premium T-Shirt", price: 299000, quantity: 2, image: "/api/placeholder/100/100" },
  //   { id: 2, name: "Stylish Jeans", price: 599000, quantity: 1, image: "/api/placeholder/100/100" },
  //   { id: 3, name: "Classic Watch", price: 899000, quantity: 1, image: "/api/placeholder/100/100" },
  // ];

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum: any, item: any) => sum + (item.product.price * item.quantity), 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" title="Cart" className="relative rounded-full">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs w-6 h-6 justify-center rounded-full">
              {totalItems}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Shopping Cart</h3>
          <Badge variant="secondary">
            {totalItems} items
          </Badge>
        </div>
        <ScrollArea className="h-[300px] pr-4">
          {
          cartItems.length > 0
            ? 
            cartItems.map((item: any) => (
            <React.Fragment key={item.id}>
              <CartItem item={item} />
              <Separator />
            </React.Fragment>
          ))
          : <div className="flex flex-col items-center justify-center h-[300px] gap-y-4">
              <ShoppingCart size={40} />
              <span className="text-sm text-slate-400">No data available</span>
            </div>
          }
        </ScrollArea>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp { useNumberFormat(totalPrice) }</span>
          </div>
          <div className="space-y-2">
            <Link href="/checkout" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
              <CreditCard />
              Checkout
            </Link>
            <Link href="/cart" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              <ShoppingCart />
              View Cart
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartDropdown