import { format } from "date-fns";

import prismaDb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismaDb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    customerName: item.customerName,
    email: item.email,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => `${orderItem.product.name} × ${orderItem.quantity}`)
      .join(", "),
    totalPrice: formatter.format(Number(item.total)),
    isPaid: item.isPaid,
    status: item.status,
    paymentMethod: item.paymentMethod,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
