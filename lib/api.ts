import { Product } from "@/app/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getProducts(params: {
  categoryId?: number;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Product[]; total: number }> {
  const session = await getServerSession(authOptions);
  const queryString = new URLSearchParams();
  if (params.categoryId) queryString.append('categoryId', params.categoryId.toString());
  if (params.isFeatured) queryString.append('isFeatured', params.isFeatured.toString());
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.token}`
      }
    });
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
  const session = await getServerSession(authOptions);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch detail products');
    }
    return response.json();
  } catch (error) {
    console.log('ERROR product GET', error);
    return {};
  }
}

export async function getCategories(params: {
  limit?: number;
}) {
  const session = await getServerSession(authOptions);
  const queryString = new URLSearchParams();
  if (params.limit) queryString.append('limit', params.limit.toString());

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  } catch (error) {
    console.log('ERROR product GET', error);
    return { data: [], total: 0};
  }
}

export async function getStoreInfo() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch shop');
    }
    return response.json();
  } catch (error) {
    console.log('ERROR product GET', error);
    return {};
  }
}

export async function getOrderList(params: { 
  id?: number; 
}) { 
  try {
    const session = await getServerSession(authOptions);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.token}`
      }
    }); 
    if (!response.ok) { 
      throw new Error('Failed to fetch orders'); 
    } 
    return response.json();
  } catch (error) { 
    console.log('ERROR product GET', error); 
    return { data: [], total: 0 }; 
  } 
}