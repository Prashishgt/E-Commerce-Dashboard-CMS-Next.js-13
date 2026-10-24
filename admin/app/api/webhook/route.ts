import { NextResponse } from "next/server";
import Stripe from "stripe";
import prismaDb from "@/lib/prismadb";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !key || !secret) return new NextResponse("Webhook is not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(key);
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid" && session.metadata?.orderId) {
      await prismaDb.order.updateMany({
        where: { id: session.metadata.orderId, stripeSessionId: session.id, paymentMethod: "stripe" },
        data: { isPaid: true, status: "paid" },
      });
    }
  }
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await prismaDb.order.updateMany({ where: { stripeSessionId: session.id, isPaid: false }, data: { status: "cancelled" } });
  }
  return NextResponse.json({ received: true });
}
