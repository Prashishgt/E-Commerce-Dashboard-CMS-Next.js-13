"use client";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ApiList from "@/components/ui/api-list";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

import { ColorColumn, columns } from "./columns";

interface ColorsClientPropsI {
  data: ColorColumn[];
}

const ColorClient = ({ data }: ColorsClientPropsI) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorClient;
