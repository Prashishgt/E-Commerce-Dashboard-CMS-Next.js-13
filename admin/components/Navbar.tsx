import { UserButton } from "@clerk/nextjs";
import { auth, isLocalDemo } from "@/lib/auth";
import React from "react";
import MainNav from "./main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { redirect } from "next/navigation";
import prismaDb from "@/lib/prismadb";

type Props = {};

const Navbar = async (props: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismaDb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {isLocalDemo ? <span className="text-xs text-muted-foreground">Local demo</span> : <UserButton afterSignOutUrl="/" />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
