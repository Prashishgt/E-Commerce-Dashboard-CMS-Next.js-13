import type { Metadata } from "next";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/components/cart-provider";
import { getCategories, getStore } from "@/lib/store";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sunday Supply | Everyday essentials",
  description: "Thoughtful goods for everyday living.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, store] = await Promise.all([getCategories(), getStore()]);
  return (
    <html lang="en">
      <body>
        <CartProvider><Navbar categories={categories} name={store.name} />
        {children}
        <Footer /></CartProvider>
      </body>
    </html>
  );
}
