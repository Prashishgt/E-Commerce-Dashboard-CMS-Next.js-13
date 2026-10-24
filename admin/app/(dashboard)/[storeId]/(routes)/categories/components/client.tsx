"use client";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ApiList from "@/components/ui/api-list";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

import { CategoryColumn, columns } from "./columns";

interface CategoryClientPropsI {
  data: CategoryColumn[];
}

const CategoryClient = ({ data }: CategoryClientPropsI) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage Categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default CategoryClient;
