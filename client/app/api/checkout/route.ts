import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const base = process.env.ADMIN_API_URL || "http://localhost:3001";
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || "demo-store";
  try {
    const response = await fetch(`${base}/api/${storeId}/checkout`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: await req.text(), cache: "no-store",
    });
    const body = await response.text();
    return new NextResponse(body, { status: response.status, headers: { "Content-Type": "application/json" } });
  } catch {
    return NextResponse.json({ error: "The shop server is unavailable. Please try again." }, { status: 503 });
  }
}
