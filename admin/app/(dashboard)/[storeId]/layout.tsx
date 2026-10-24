import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prismaDb from "@/lib/prismadb";
import Navbar from "@/components/Navbar";

type dashboardPropsI = {
  children: React.ReactNode;
  params: { storeId: string };
};

const layout = async ({ children, params }: dashboardPropsI) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismaDb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default layout;
