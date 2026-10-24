import Link from "next/link";
import prismaDb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

export default async function DashboardPage({ params }: { params: { storeId: string } }) {
  const [store, products, orders, categories] = await Promise.all([
    prismaDb.store.findUnique({ where: { id: params.storeId } }),
    prismaDb.product.count({ where: { storeId: params.storeId, isArchived: false } }),
    prismaDb.order.findMany({ where: { storeId: params.storeId }, include: { orderItems: { include: { product: true } } }, orderBy: { createdAt: "desc" } }),
    prismaDb.category.count({ where: { storeId: params.storeId } }),
  ]);
  const revenue = orders.filter((order) => order.isPaid).reduce((sum, order) => sum + Number(order.total), 0);
  const pending = orders.filter((order) => !["fulfilled", "cancelled"].includes(order.status)).length;
  const cards = [["Revenue received", formatter.format(revenue), "Paid orders only"], ["Orders", String(orders.length), `${pending} need attention`], ["Products", String(products), "Visible in storefront"], ["Categories", String(categories), "Collections to browse"]];
  return <main className="space-y-8 p-6 pt-8 sm:p-8">
    <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Store overview</p><h1 className="mt-2 text-3xl font-bold tracking-tight">{store?.name || "Dashboard"}</h1><p className="mt-2 text-muted-foreground">A quick look at your catalog and orders.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, detail]) => <div key={label} className="rounded-xl border bg-white p-6 shadow-sm"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p></div>)}</div>
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]"><section className="rounded-xl border bg-white p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">Recent orders</h2><Link href={`/${params.storeId}/orders`} className="text-sm underline">View all</Link></div>{orders.length ? <div className="space-y-3">{orders.slice(0, 5).map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 border-t py-3 text-sm"><div><p className="font-medium">{order.customerName || "Customer"}</p><p className="text-muted-foreground">{order.orderItems.map((item) => `${item.product.name} × ${item.quantity}`).join(", ")}</p></div><div className="text-right"><p className="font-semibold">{formatter.format(Number(order.total))}</p><p className="capitalize text-muted-foreground">{order.status.replaceAll("_", " ")}</p></div></div>)}</div> : <p className="text-sm text-muted-foreground">Orders will appear here after checkout.</p>}</section><section className="rounded-xl border bg-white p-6"><h2 className="text-xl font-semibold">Quick actions</h2><div className="mt-5 grid gap-3 text-sm"><Link className="rounded-lg border p-3 hover:bg-muted" href={`/${params.storeId}/products/new`}>+ Add a product</Link><Link className="rounded-lg border p-3 hover:bg-muted" href={`/${params.storeId}/billboards/new`}>+ Add a billboard</Link><Link className="rounded-lg border p-3 hover:bg-muted" href={`/${params.storeId}/settings`}>Store settings and API URL</Link></div><p className="mt-6 text-xs text-muted-foreground">Local demo data is editable. New orders from the storefront show up here.</p></section></div>
  </main>;
}
