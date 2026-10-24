import Link from "next/link";
import ProductCard from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/store";

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const hero = categories[0]?.billboard;
  return <main>
    <section className="relative isolate min-h-[530px] overflow-hidden bg-[#d9d4ca] text-white">
      {hero?.imageUrl && <img src={hero.imageUrl} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
      <div className="mx-auto flex min-h-[530px] max-w-7xl flex-col justify-center px-5 py-16 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]">A small collection of useful things</p>
        <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-7xl">Make the everyday feel a little better.</h1>
        <p className="mt-6 max-w-lg text-base text-white/85">Thoughtful staples for what you wear, where you live, and wherever you go.</p>
        <Link href="#featured" className="mt-8 w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-orange-100">Explore the collection →</Link>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" id="featured">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">Curated for you</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Featured pieces</h2></div><span className="text-sm text-stone-500">{products.length} pieces</span></div>
      {products.length ? <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{products.filter((product) => product.isFeatured).slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center"><h3 className="text-xl font-semibold">Your store is ready for products</h3><p className="mt-2 text-stone-500">Start the admin app and run the seed command to see the collection here.</p></div>}
    </section>
    {categories.length > 0 && <section className="bg-[#eeeae2] py-20"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">Find your corner</p><h2 className="mt-2 mb-8 text-3xl font-semibold tracking-tight">Shop by category</h2><div className="grid gap-5 md:grid-cols-3">{categories.map((category) => <Link href={`/category/${category.id}`} key={category.id} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-300">{category.billboard?.imageUrl && <img src={category.billboard.imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><span className="absolute bottom-6 left-6 text-2xl font-semibold text-white">{category.name} <span aria-hidden>↗</span></span></Link>)}</div></div></section>}
  </main>;
}
