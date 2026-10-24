import Link from "next/link";

export default function Footer() {
  return <footer className="mt-24 border-t border-stone-200 bg-stone-100/60">
    <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8 px-5 py-12 text-sm text-stone-600 sm:px-8">
      <div><p className="text-lg font-semibold text-stone-950">Sunday Supply.</p><p className="mt-2">Good things for everyday living.</p></div>
      <div className="flex gap-6"><Link href="/">Shop</Link><Link href="/cart">Your bag</Link></div>
      <p>Personal project · Made to explore and learn</p>
    </div>
  </footer>;
}
