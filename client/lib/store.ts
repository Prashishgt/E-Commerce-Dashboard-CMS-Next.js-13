import { Category, Product, Store } from "@/types";

const base = process.env.ADMIN_API_URL || "http://localhost:3001";
export const storeId = process.env.NEXT_PUBLIC_STORE_ID || "demo-store";

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${base}/api/${path}`, { cache: "no-store" });
    return response.ok ? (await response.json()) as T : fallback;
  } catch {
    return fallback;
  }
}

export const getStore = () => get<Store>(`stores/${storeId}`, { id: storeId, name: "Sunday Supply" });
export const getCategories = () => get<Category[]>(`${storeId}/categories`, []);
export const getProducts = (query = "") => get<Product[]>(`${storeId}/products${query}`, []);
export const getProduct = (id: string) => get<Product | null>(`${storeId}/products/${id}`, null);
