import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import CartItem from './cart-item';

const CartDropdown = () => {
  const cartItems = [
    { id: 1, name: "Premium T-Shirt", price: 299000, quantity: 2, image: "/api/placeholder/100/100" },
    { id: 2, name: "Stylish Jeans", price: 599000, quantity: 1, image: "/api/placeholder/100/100" },
    { id: 3, name: "Classic Watch", price: 899000, quantity: 1, image: "/api/placeholder/100/100" },
  ];

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
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
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <CartItem item={item} />
              <Separator />
            </React.Fragment>
          ))}
        </ScrollArea>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp {totalPrice.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <Button className="w-full">
              Checkout
            </Button>
            <Button variant="outline" className="w-full">
              View Cart
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartDropdown