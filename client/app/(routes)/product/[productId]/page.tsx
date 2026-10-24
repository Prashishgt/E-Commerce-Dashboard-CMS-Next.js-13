import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/add-to-cart";
import { getProduct } from "@/lib/store";

export default async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await getProduct(params.productId);
  if (!product) notFound();
  return <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><Link href={`/category/${product.category.id}`} className="text-sm text-stone-500 hover:underline">← {product.category.name}</Link><div className="mt-7 grid gap-10 md:grid-cols-2 lg:gap-16"><div className="grid gap-4">{product.images.map((image) => <div key={image.id} className="aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100"><img src={image.url} alt={product.name} className="h-full w-full object-cover" /></div>)}</div><div className="md:sticky md:top-28 md:self-start"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">{product.category.name}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1><p className="mt-5 text-2xl">${Number(product.price).toFixed(2)}</p><p className="mt-8 leading-7 text-stone-600">A considered addition to your everyday. Carefully selected for its simple style and useful details.</p><div className="my-8 border-y border-stone-200 py-6 text-sm"><p className="flex justify-between"><span className="text-stone-500">Size</span><span>{product.size.name}</span></p><p className="mt-4 flex justify-between"><span className="text-stone-500">Color</span><span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border" style={{ backgroundColor: product.color.value }} />{product.color.name}</span></p></div><AddToCart product={product} /><p className="mt-4 text-center text-xs text-stone-500">Free browsing. Checkout supports Stripe test mode and cash on delivery.</p></div></div></main>;
}
