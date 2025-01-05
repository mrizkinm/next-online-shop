import React from 'react'
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const FeaturedProducts = () => {
  const products = [
    { id: 1, name: "Premium Product 1", price: "299.000", image: "/api/placeholder/300/300" },
    { id: 2, name: "Premium Product 2", price: "399.000", image: "/api/placeholder/300/300" },
    { id: 3, name: "Premium Product 3", price: "199.000", image: "/api/placeholder/300/300" },
    { id: 4, name: "Premium Product 4", price: "499.000", image: "/api/placeholder/300/300" },
    { id: 5, name: "Premium Product 5", price: "599.000", image: "/api/placeholder/300/300" },
    { id: 6, name: "Premium Product 6", price: "599.000", image: "/api/placeholder/300/300" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="group cursor-pointer">
          <CardContent className="p-4">
            <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-md">{product.name}</h3>
            <p className="text-gray-600">Rp {product.price}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedProducts