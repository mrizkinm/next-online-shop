import React from 'react'

const CategorySection = () => {
  const categories = [
    { id: 1, name: "Fashion", image: "/api/placeholder/400/200" },
    { id: 2, name: "Electronics", image: "/api/placeholder/400/200" },
    { id: 3, name: "Home & Living", image: "/api/placeholder/400/200" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category.id} className="group relative cursor-pointer">
          <div className="aspect-[2/1] overflow-hidden rounded-lg">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">{category.name}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySection