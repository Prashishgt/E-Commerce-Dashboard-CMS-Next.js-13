import Link from "next/link";
import ClearCart from "./clear-cart";

export default function SuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  return <main className="mx-auto max-w-2xl px-5 py-24 text-center"><ClearCart /><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-800">✓</div><h1 className="mt-6 text-4xl font-semibold tracking-tight">Thanks for your order!</h1><p className="mt-4 text-stone-600">Your order has been received. If you used Stripe, payment confirmation may take a moment to appear in the admin dashboard.</p>{searchParams.order && <p className="mt-5 rounded-lg bg-stone-100 p-3 font-mono text-sm break-all">Order {searchParams.order}</p>}<Link href="/" className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white">Keep exploring</Link></main>;
}
