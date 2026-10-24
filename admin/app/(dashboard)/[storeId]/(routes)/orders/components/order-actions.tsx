"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { OrderColumn } from "./columns";

export default function OrderActions({ order }: { order: OrderColumn }) {
  const params = useParams();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function update(data: { status: "pending" | "paid" | "fulfilled" | "cancelled"; isPaid?: boolean }) {
    setBusy(true);
    try {
      const response = await fetch(`/api/${params.storeId}/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error(await response.text());
      toast.success("Order updated"); router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update order"); }
    finally { setBusy(false); }
  }
  return <div className="flex gap-2 whitespace-nowrap">
    {order.paymentMethod === "cod" && !order.isPaid && <Button size="sm" variant="outline" disabled={busy} onClick={() => update({ status: "paid", isPaid: true })}>Mark paid</Button>}
    {order.status !== "fulfilled" && order.status !== "cancelled" && <Button size="sm" variant="outline" disabled={busy} onClick={() => update({ status: "fulfilled" })}>Fulfill</Button>}
  </div>;
}
