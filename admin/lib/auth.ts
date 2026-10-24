import { auth as clerkAuth } from "@clerk/nextjs";

export const isLocalDemo = process.env.LOCAL_DEMO_MODE === "true";

export function auth() {
  return isLocalDemo ? { userId: "local-demo-user" } : clerkAuth();
}
