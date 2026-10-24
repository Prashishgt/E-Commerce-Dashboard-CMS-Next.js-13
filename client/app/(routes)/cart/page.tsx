"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";

export default function CartPage() {
  const { items, ready, remove, setQuantity, clear } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        customerName: form.get("customerName"), email: form.get("email"), phone: form.get("phone"), address: form.get("address"), paymentMethod,
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Checkout failed.");
      if (result.url) { window.location.assign(result.url); return; }
      clear(); router.push(`/checkout/success?order=${result.orderId}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Checkout failed."); setWorking(false); }
  }

  return <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><h1 className="text-4xl font-semibold tracking-tight">Your bag</h1><p className="mt-2 text-stone-500">Review your pieces and choose how to pay.</p>
    {!ready ? <p className="mt-12">Loading your bag…</p> : !items.length ? <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-12 text-center"><p className="text-xl font-medium">Your bag is empty</p><Link href="/" className="mt-6 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white">Continue shopping</Link></div> : <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]"><div className="space-y-5">{items.map(({ product, quantity }) => <div key={product.id} className="flex gap-5 border-b border-stone-200 pb-5"><Link href={`/product/${product.id}`} className="h-28 w-24 flex-none overflow-hidden rounded-xl bg-stone-100">{product.images[0] && <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />}</Link><div className="flex-1"><Link href={`/product/${product.id}`} className="font-semibold hover:underline">{product.name}</Link><p className="mt-1 text-sm text-stone-500">{product.color.name} · {product.size.name}</p><button className="mt-5 text-xs text-stone-500 underline" onClick={() => remove(product.id)}>Remove</button></div><div className="text-right"><p className="font-semibold">${(Number(product.price) * quantity).toFixed(2)}</p><label className="mt-5 block text-xs text-stone-500">Quantity <input type="number" min="1" max="20" value={quantity} onChange={(event) => setQuantity(product.id, Number(event.target.value))} className="ml-2 w-14 rounded border px-2 py-1 text-stone-900" /></label></div></div>)}</div><form onSubmit={checkout} className="h-fit rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-semibold">Checkout</h2><div className="mt-5 space-y-4">{[["customerName", "Full name", "text"], ["email", "Email", "email"], ["phone", "Phone", "tel"]].map(([name, label, type]) => <label key={name} className="block text-sm font-medium">{label}<input name={name} type={type} required className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-3 outline-none focus:border-stone-900" /></label>)}<label className="block text-sm font-medium">Delivery address<textarea name="address" required minLength={8} rows={3} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-3 outline-none focus:border-stone-900" /></label></div><fieldset className="mt-6"><legend className="text-sm font-semibold">Payment method</legend><label className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm"><input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />Cash on delivery</label><label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm"><input type="radio" name="payment" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} />Stripe test checkout <span className="ml-auto text-xs text-stone-500">Cards and eligible methods</span></label></fieldset><div className="mt-6 flex justify-between border-t pt-5 text-lg font-semibold"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}<button disabled={working} type="submit" className="mt-6 w-full rounded-full bg-stone-900 px-6 py-4 font-semibold text-white hover:bg-orange-800 disabled:opacity-50">{working ? "Starting checkout…" : paymentMethod === "cod" ? "Place order" : "Continue to Stripe"}</button><p className="mt-3 text-center text-xs text-stone-500">This is a personal demo shop. Stripe runs in test mode.</p></form></div>}
  </main>;
}
