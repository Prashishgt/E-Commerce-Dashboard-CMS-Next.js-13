"use client";

import Link from "next/link";
import { Category } from "@/types";
import { useCart } from "@/components/cart-provider";

export default function Navbar({ categories, name }: { categories: Category[]; name: string }) {
  const { items, ready } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#faf9f6]/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
      <Link href="/" className="text-xl font-semibold tracking-[-0.04em]">{name}<span className="text-orange-700">.</span></Link>
      <nav className="order-3 flex w-full gap-5 overflow-x-auto text-sm text-stone-600 sm:order-2 sm:w-auto" aria-label="Categories">
        <Link href="/" className="whitespace-nowrap hover:text-stone-950">Shop all</Link>
        {categories.map((category) => <Link key={category.id} href={`/category/${category.id}`} className="whitespace-nowrap hover:text-stone-950">{category.name}</Link>)}
      </nav>
      <Link href="/cart" className="order-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium hover:border-stone-950 sm:order-3">Bag ({ready ? count : 0})</Link>
    </div>
  </header>;
}
