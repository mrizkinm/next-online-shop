export interface StoreInfo {
  name: string; // Nama toko
  address: string; // Alamat toko
  phone: string; // Nomor telepon toko
  email: string;
  description: string;
}

export interface Image {
  id: number;
  productId: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  categoryId: number;
  category: Category;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  images: Image[];
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}