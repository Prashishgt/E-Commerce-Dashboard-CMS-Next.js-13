import prismaDb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product Id is required, product route", {
        status: 400,
      });
    }

    const product = await prismaDb.product.findFirst({
      where: {
        id: params.productId,
        storeId: params.storeId,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is required, product route", {
        status: 400,
      });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const hasOrders = await prismaDb.orderItem.count({ where: { productId: params.productId } });
    if (hasOrders) {
      const product = await prismaDb.product.updateMany({ where: { id: params.productId, storeId: params.storeId }, data: { isArchived: true } });
      return NextResponse.json({ ...product, archived: true });
    }
    const product = await prismaDb.product.deleteMany({ where: { id: params.productId, storeId: params.storeId } });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      images,
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required, product route", {
        status: 400,
      });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const [existing, category, color, size] = await Promise.all([
      prismaDb.product.findFirst({ where: { id: params.productId, storeId: params.storeId } }),
      prismaDb.category.findFirst({ where: { id: categoryId, storeId: params.storeId } }),
      prismaDb.color.findFirst({ where: { id: colorId, storeId: params.storeId } }),
      prismaDb.size.findFirst({ where: { id: sizeId, storeId: params.storeId } }),
    ]);
    if (!existing || !category || !color || !size) return new NextResponse("Product or selection not found in this store", { status: 400 });
    const product = await prismaDb.product.update({
      where: { id: existing.id },
      data: {
        name, price, categoryId, colorId, sizeId, isFeatured, isArchived,
        images: { deleteMany: {}, createMany: { data: images.map((image: { url: string }) => ({ url: image.url })) } },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
