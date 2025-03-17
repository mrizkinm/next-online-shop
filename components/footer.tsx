'use client'

import { Category } from '@/app/types';
import { useStore } from "@/store/shop-store";
import { Mail, Phone, Route } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

interface FooterProps {
  categories: Category[];
}

const Footer: React.FC<FooterProps>  = ({categories}) => {
  const { storeInfo } = useStore();

  return (
    <footer className="bg-white dark:bg-gray-950 mt-16">
      <div className="border-t">
        <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">{storeInfo?.name}</h3>
              <p className="text-gray-500">{storeInfo?.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <p className="text-gray-500 hover:text-gray-900 hover:dark:text-gray-300"><Link href="/">Home</Link></p>
                <p className="text-gray-500 hover:text-gray-900 hover:dark:text-gray-300"><Link href="/about">About Us</Link></p>
                <p className="text-gray-500 hover:text-gray-900 hover:dark:text-gray-300"><Link href="/contact">Contact</Link></p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <p key={category.id} className="text-gray-500 hover:text-gray-900 hover:dark:text-gray-300"><Link href={`/products?categoryId=${category.id}`}>{category.name}</Link></p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-500">
                <p className="flex items-center gap-2">
                  <Mail /> <span>{storeInfo?.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone /> <span>{storeInfo?.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Route /> <span>{storeInfo?.address}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t text-center text-gray-500">
        <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full py-8">
          <p>© {new Date().getFullYear()} {storeInfo?.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer