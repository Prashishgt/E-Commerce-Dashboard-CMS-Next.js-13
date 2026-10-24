import prismaDb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import SettingsForm from "./components/settings-form";

interface SettingPagePropsI {
  params: {
    storeId: string;
  };
}

const page = async ({ params }: SettingPagePropsI) => {
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
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default page;
