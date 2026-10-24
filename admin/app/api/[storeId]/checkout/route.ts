import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import prismaDb from "@/lib/prismadb";

const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1).max(30),
  customerName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(8).max(500),
  paymentMethod: z.enum(["cod", "stripe"]),
});

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your checkout details." }, { status: 400 });
  const { items, paymentMethod, ...contact } = parsed.data;
  if (new Set(items.map((item) => item.productId)).size !== items.length) {
    return NextResponse.json({ error: "Duplicate products in cart." }, { status: 400 });
  }
  if (paymentMethod === "stripe" && !process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
    return NextResponse.json({ error: "Stripe test checkout is not configured. Choose cash on delivery." }, { status: 503 });
  }

  try {
    const store = await prismaDb.store.findUnique({ where: { id: params.storeId } });
    if (!store) return NextResponse.json({ error: "Store not found." }, { status: 404 });
    const products = await prismaDb.product.findMany({
      where: { storeId: params.storeId, id: { in: items.map((item) => item.productId) }, isArchived: false },
    });
    if (products.length !== items.length) return NextResponse.json({ error: "Some products are no longer available." }, { status: 400 });

    const lines = items.map((item) => ({ product: products.find((product) => product.id === item.productId)!, quantity: item.quantity }));
    const total = lines.reduce((sum, line) => sum + Math.round(Number(line.product.price) * 100) * line.quantity, 0);
    const order = await prismaDb.order.create({
      data: {
        storeId: params.storeId, ...contact, paymentMethod,
        total: (total / 100).toFixed(2),
        status: paymentMethod === "cod" ? "pending" : "awaiting_payment",
        orderItems: { create: lines.map((line) => ({ productId: line.product.id, quantity: line.quantity, unitPrice: line.product.price })) },
      },
    });
    if (paymentMethod === "cod") return NextResponse.json({ orderId: order.id });

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const storefront = process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000";
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: contact.email,
        line_items: lines.map((line) => ({
          quantity: line.quantity,
          price_data: { currency: "usd", unit_amount: Math.round(Number(line.product.price) * 100), product_data: { name: line.product.name } },
        })),
        metadata: { orderId: order.id, storeId: params.storeId },
        success_url: `${storefront}/checkout/success?order=${order.id}`,
        cancel_url: `${storefront}/cart?cancelled=1`,
      });
      if (!session.url) throw new Error("Stripe did not return a checkout URL");
      await prismaDb.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
      return NextResponse.json({ orderId: order.id, url: session.url });
    } catch (error) {
      await prismaDb.order.delete({ where: { id: order.id } });
      throw error;
    }
  } catch (error) {
    console.error("[CHECKOUT]", error);
    return NextResponse.json({ error: "Checkout could not be started." }, { status: 500 });
  }
}
