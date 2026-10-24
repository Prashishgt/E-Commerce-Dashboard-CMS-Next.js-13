export interface Billboard { id: string; label: string; imageUrl: string }
export interface Category { id: string; name: string; billboard: Billboard }
export interface Product {
  id: string;
  name: string;
  price: string;
  isFeatured: boolean;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
  size: { id: string; name: string; value: string };
  color: { id: string; name: string; value: string };
}
export interface Store { id: string; name: string }
