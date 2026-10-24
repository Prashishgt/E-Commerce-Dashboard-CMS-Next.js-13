"use client";

import { ColumnDef } from "@tanstack/react-table";
import OrderActions from "./order-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  isPaid: boolean;
  status: string;
  paymentMethod: string;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  { accessorKey: "customerName", header: "Customer" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => <span className="uppercase">{row.original.paymentMethod}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="capitalize">{row.original.status.replaceAll("_", " ")}{row.original.isPaid ? " · paid" : ""}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  { id: "actions", cell: ({ row }) => <OrderActions order={row.original} /> },
];
