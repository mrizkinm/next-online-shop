import React from 'react'

const ProductListSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg">
            <div className="aspect-square" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-1/3 bg-gray-300 rounded" />
              <div className="h-6 w-2/3 bg-gray-300 rounded" />
              <div className="h-4 w-1/4 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListSkeleton