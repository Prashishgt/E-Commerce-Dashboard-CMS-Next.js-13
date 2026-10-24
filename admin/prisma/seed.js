require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();
const storeId = "demo-store";

async function main() {
  await db.store.upsert({
    where: { id: storeId },
    update: {},
    create: { id: storeId, name: "Sunday Supply", userId: "local-demo-user" },
  });

  const billboards = [
    ["everyday", "Made for everyday living", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85"],
    ["workspace", "Objects for a considered space", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=85"],
    ["outdoors", "Take the long way home", "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1600&q=85"],
  ];
  for (const [id, label, imageUrl] of billboards) {
    await db.billboard.upsert({ where: { id }, update: {}, create: { id, label, imageUrl, storeId } });
  }

  const categories = [
    ["apparel", "Apparel", "everyday"],
    ["home", "Home", "workspace"],
    ["outdoor", "Outdoor", "outdoors"],
  ];
  for (const [id, name, billboardId] of categories) {
    await db.category.upsert({ where: { id }, update: {}, create: { id, name, billboardId, storeId } });
  }

  for (const [id, name, value] of [["one-size", "One size", "OS"], ["small", "Small", "S"], ["medium", "Medium", "M"], ["large", "Large", "L"]]) {
    await db.size.upsert({ where: { id }, update: {}, create: { id, name, value, storeId } });
  }
  for (const [id, name, value] of [["sand", "Sand", "#d7c8aa"], ["charcoal", "Charcoal", "#30363b"], ["sage", "Sage", "#8d9a82"], ["rust", "Rust", "#ae6753"]]) {
    await db.color.upsert({ where: { id }, update: {}, create: { id, name, value, storeId } });
  }

  const products = [
    ["canvas-tote", "Everyday Canvas Tote", "apparel", "one-size", "sand", "28.00", "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=85"],
    ["linen-shirt", "Relaxed Linen Shirt", "apparel", "medium", "sage", "64.00", "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=900&q=85"],
    ["ceramic-vase", "Sculpted Ceramic Vase", "home", "one-size", "sand", "46.00", "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&q=85"],
    ["desk-lamp", "Modern Desk Lamp", "home", "one-size", "charcoal", "89.00", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=85"],
    ["weekend-bag", "Weekend Carryall", "outdoor", "one-size", "rust", "118.00", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85"],
    ["field-jacket", "Lightweight Field Jacket", "outdoor", "large", "sage", "142.00", "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900&q=85"],
  ];
  for (const [id, name, categoryId, sizeId, colorId, price, url] of products) {
    await db.product.upsert({
      where: { id },
      update: {},
      create: { id, name, categoryId, sizeId, colorId, price, storeId, isFeatured: true, images: { create: [{ url }] } },
    });
  }

  await db.order.upsert({
    where: { id: "sample-cod-order" }, update: {},
    create: {
      id: "sample-cod-order", storeId, customerName: "Alex Rivera", email: "alex@example.com",
      phone: "555-0100", address: "12 Market Street, Portland", paymentMethod: "cod",
      total: "74.00", status: "pending", isPaid: false,
      orderItems: { create: [{ productId: "canvas-tote", quantity: 1, unitPrice: "28.00" }, { productId: "ceramic-vase", quantity: 1, unitPrice: "46.00" }] },
    },
  });
  await db.order.upsert({
    where: { id: "sample-paid-order" }, update: {},
    create: {
      id: "sample-paid-order", storeId, customerName: "Taylor Lee", email: "taylor@example.com",
      phone: "555-0199", address: "8 Pine Avenue, Seattle", paymentMethod: "cod",
      total: "64.00", status: "fulfilled", isPaid: true,
      orderItems: { create: [{ productId: "linen-shirt", quantity: 1, unitPrice: "64.00" }] },
    },
  });
  console.log("Seeded Sunday Supply, 6 products and 2 sample orders.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
