import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
const clerkMiddleware = authMiddleware({
  publicRoutes: ["/", "/api/(.*)"],
});

export default function middleware(req: Parameters<typeof clerkMiddleware>[0], event: Parameters<typeof clerkMiddleware>[1]) {
  if (process.env.LOCAL_DEMO_MODE === "true") return NextResponse.next();
  return clerkMiddleware(req, event);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
