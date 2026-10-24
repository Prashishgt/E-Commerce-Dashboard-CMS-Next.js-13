import prismaDb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size Id is required", {
        status: 400,
      });
    }

    const size = await prismaDb.size.findFirst({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size Id is required", {
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

    const size = await prismaDb.size.deleteMany({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 500 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 500 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", {
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

    const size = await prismaDb.size.updateMany({
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
