"use client";

import { getManager } from "@/helper/fetchApi";
import { User } from "@/types/type";
import { useEffect, useState } from "react";
import { DataTable } from "./ManagerDataTable";
import AddManagerForm from "./AddManagerForm";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@nextui-org/react";
import { ArrowUpDown } from "lucide-react";

const managerColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 m-0"
        >
          Tài khoản
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

const ManagerListTable = ({ role }: { role: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalManagers, setTotalManagers] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchManagers = async (param: string) => {
    setIsLoading(true);
    try {
      const res = await getManager(param);
      setUsers(res);
      setTotalManagers(res.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers(role);
  }, [role]);

  return (
    <div className="py-10">
      <div className="flex">
        <p>
          Tổng số lượng tài khoản {role}: {totalManagers}
        </p>
      </div>

      <div className="my-5">
        {role !== "Student" && (
          <AddManagerForm role={role} onSuccess={() => fetchManagers(role)} />
        )}
      </div>

      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <DataTable
          fetchData={() => fetchManagers(role)}
          columns={managerColumns}
          data={users}
        />
      )}
    </div>
  );
};

export default ManagerListTable;
