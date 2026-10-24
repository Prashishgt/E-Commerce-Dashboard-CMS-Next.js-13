import prismaDb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

type RootPropsI = {
  children: React.ReactNode;
};

const SetupLayout = async ({ children }: RootPropsI) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismaDb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }
  return <>{children}</>;
};

export default SetupLayout;
