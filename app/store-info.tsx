import { StoreInfo } from './types';

export async function getStoreInfo(): Promise<StoreInfo> {
  try {
    const res = await fetch('http://localhost:3000/api/data/shop', { method: "GET" });
    if (!res.ok) {
      throw new Error('Failed to fetch store information');
    }
    const responseData = await res.json();
    return responseData[0];
  } catch (error) {
    console.error(error);
    return {
      name: 'Error',
      address: 'Error',
      phone: '/img/default.jpg',
    };
  }
}