import Link from "next/link";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return <Link href={`/product/${product.id}`} className="group block">
    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
      {product.images[0] && <><img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></>}
    </div>
    <div className="mt-4 flex items-start justify-between gap-3">
      <div><p className="text-xs uppercase tracking-[0.2em] text-stone-500">{product.category.name}</p><h3 className="mt-1 font-medium text-stone-900 group-hover:underline">{product.name}</h3></div>
      <span className="font-medium">${Number(product.price).toFixed(2)}</span>
    </div>
  </Link>;
}
