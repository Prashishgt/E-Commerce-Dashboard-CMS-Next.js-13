import { auth } from "@/lib/auth";
import prismaDb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ status: z.enum(["pending", "paid", "fulfilled", "cancelled"]), isPaid: z.boolean().optional() });

export async function PATCH(req: Request, { params }: { params: { storeId: string; orderId: string } }) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
  const store = await prismaDb.store.findFirst({ where: { id: params.storeId, userId } });
  if (!store) return new NextResponse("Forbidden", { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse("Invalid order update", { status: 400 });
  const existing = await prismaDb.order.findFirst({ where: { id: params.orderId, storeId: params.storeId } });
  if (!existing) return new NextResponse("Order not found", { status: 404 });
  if (existing.paymentMethod === "stripe" && parsed.data.isPaid !== undefined) return new NextResponse("Stripe payment status is set by the webhook", { status: 400 });
  if (existing.paymentMethod === "stripe" && !existing.isPaid && parsed.data.status === "fulfilled") return new NextResponse("Wait for Stripe payment confirmation", { status: 400 });
  const order = await prismaDb.order.update({ where: { id: existing.id }, data: { status: parsed.data.status, ...(parsed.data.isPaid === undefined ? {} : { isPaid: parsed.data.isPaid }) } });
  return NextResponse.json(order);
}
