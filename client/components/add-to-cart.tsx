"use client";
import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/components/cart-provider";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return <button className="w-full rounded-full bg-stone-900 px-6 py-4 font-semibold text-white hover:bg-orange-800" onClick={() => { add(product); setAdded(true); setTimeout(() => setAdded(false), 1800); }}>{added ? "Added to bag ✓" : "Add to bag"}</button>;
}
