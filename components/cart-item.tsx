import React from 'react'
import { Button } from './ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item } : any) => (
  <div className="flex items-center py-4">
    <div className="w-16 h-16 relative rounded overflow-hidden">
      <img
        src={item.image}
        alt={item.name}
        className="object-cover w-full h-full"
      />
    </div>
    <div className="ml-4 flex-1">
      <h4 className="font-medium text-sm">{item.name}</h4>
      <p className="text-gray-500 text-sm">Rp {item.price.toLocaleString()}</p>
      <div className="flex items-center mt-1 space-x-2">
        <Button variant="outline" size="icon" className="h-6 w-6">
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm">{item.quantity}</span>
        <Button variant="outline" size="icon" className="h-6 w-6">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
    <Button variant="ghost" size="icon" className="text-red-500">
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export default CartItem