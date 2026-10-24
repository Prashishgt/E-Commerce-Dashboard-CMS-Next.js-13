import { notFound } from "next/navigation";
import ProductCard from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/store";

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const [categories, products] = await Promise.all([getCategories(), getProducts(`?categoryId=${encodeURIComponent(params.categoryId)}`)]);
  const category = categories.find((item) => item.id === params.categoryId);
  if (!category) notFound();
  return <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
    <div className="relative flex min-h-[260px] items-end overflow-hidden rounded-2xl bg-stone-700 p-8 text-white sm:p-12">{category.billboard?.imageUrl && <img src={category.billboard.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="relative"><p className="text-xs uppercase tracking-[0.25em]">The collection</p><h1 className="mt-2 text-5xl font-semibold tracking-tight">{category.name}</h1></div></div>
    <p className="my-8 text-sm text-stone-500">{products.length} products</p>
    {products.length ? <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="rounded-xl border p-8 text-stone-500">No products in this category yet.</p>}
  </main>;
}
