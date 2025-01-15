import { Product } from "@/app/types";

export async function getProducts(params: {
  categoryId?: number;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Product[]; total: number }> {
  const queryString = new URLSearchParams();
  try{
    if (params.categoryId) queryString.append('categoryId', params.categoryId.toString());
    if (params.isFeatured) queryString.append('isFeatured', params.isFeatured.toString());
    if (params.search) queryString.append('search', params.search);
    if (params.page) queryString.append('page', params.page.toString());
    if (params.limit) queryString.append('limit', params.limit.toString());

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/products?${queryString}`);
    if (!response.ok) {
      throw new Error(JSON.stringify(response));
    }
  return response.json();
  } catch (error) {
    console.log('ERROR product GET', error);
    return { data: [], total: 0};
  }
}

export async function getProductDetail(params: {
  id?: number;
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/products/${params.id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch detail products');
  }
  return response.json();
}

export async function getCategories(params: {
  limit?: number;
}) {
  const queryString = new URLSearchParams();

  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/categories?${queryString}`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function getStoreInfo() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/shop`);
  if (!response.ok) {
    throw new Error('Failed to fetch shop');
  }
  return response.json();
}