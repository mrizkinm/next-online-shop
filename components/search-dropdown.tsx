import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from './ui/card';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Product } from '@/app/types';
import Link from 'next/link';
import { useNumberFormat } from '@/hooks/use-number-format';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const SearchDropdown = () => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);

    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setDropdownOpen(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/search?query=${encodeURIComponent(searchTerm)}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`
        }
      });
      const data = await response.json();
  
      if (response.ok) {
        setFilteredProducts(data);
        setDropdownOpen(true);
      } else {
        console.error(data.message);
        setFilteredProducts([]);
        setDropdownOpen(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setFilteredProducts([]);
      setDropdownOpen(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  const handleItemClick = () => {
    // Tutup dropdown ketika item diklik
    setQuery("");
    setDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
   <div>
     <div className="relative lg:max-w-lg w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={handleSearch}
          className="pl-8"
        />
      </div>

      {dropdownOpen && (
        <Card
          ref={dropdownRef}
          className="absolute top-12 left-0 w-full z-10 bg-white dark:bg-slate-950 shadow-lg border max-h-72 overflow-y-auto"
        >
          <CardContent className="p-0">
            {filteredProducts.length > 0 ? (
              <ul>
                {filteredProducts.map((product, index) => {
                  const formattedPrice = useNumberFormat(product.price);
                  return (
                    <li
                      key={product.id}
                      className={`hover:bg-gray-100 dark:hover:bg-slate-900 cursor-pointer ${
                        index === 0 ? "rounded-t-md" : "" // Tambahkan radius untuk item pertama
                      } ${
                        index === filteredProducts.length - 1 ? "rounded-b-md" : "" // Tambahkan radius untuk item terakhir
                      }`}
                    >
                      <Link
                        href={`/products/${product.id}`}
                        className="flex items-center gap-4 px-4 py-2"
                        onClick={handleItemClick}
                      >
                        <Image
                          src={`${product.images?.[0].url}` || "/img/default.jpg"} // Placeholder jika gambar tidak ada
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            Rp {formattedPrice}
                          </p>
                        </div>
                      </Link>
                    </li>
                )})}
              </ul>
            ) : (
              <p className="flex items-center px-4 py-2 text-gray-500 text-sm h-12">No results found</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
   </div>
  )
}

export default SearchDropdown