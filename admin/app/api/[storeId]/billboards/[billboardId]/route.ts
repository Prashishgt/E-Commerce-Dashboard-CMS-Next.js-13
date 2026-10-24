import prismaDb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required, billboard route", {
        status: 400,
      });
    }

    const billboard = await prismaDb.billboard.findFirst({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required, billboard route", {
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

    const billboard = await prismaDb.billboard.deleteMany({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 500 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 500 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required, billboard route", {
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

    const billboard = await prismaDb.billboard.updateMany({
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
