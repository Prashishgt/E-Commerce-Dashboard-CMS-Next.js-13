import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { isLocalDemo } from "@/lib/auth";

export default function Page() {
  if (isLocalDemo) redirect("/");
  return <SignIn />;
}
