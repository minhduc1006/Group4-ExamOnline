"use client";

import { getManager } from "@/helper/fetchApi";
import { User } from "@/types/type";
import { useEffect, useState } from "react";
import { DataTable } from "./ManagerDataTable";
import AddManagerForm from "./AddManagerForm";
import { ColumnDef } from "@tanstack/react-table";

const managerColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "username",
    header: "Tài khoản",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

const ManagerListTable = ({ role }: { role: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchManagers = async (param: string) => {
    setIsLoading(true);
    try {
      const res = await getManager(param);
      setUsers(res);
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
      <div className="my-5">
        {role !== "User" && <AddManagerForm role={role} onSuccess={() => fetchManagers(role)} />}
      </div>

      {isLoading && <div>Loading...</div>}
      {!isLoading && <DataTable fetchData={() => fetchManagers(role)} columns={managerColumns} data={users} />}
    </div>
  );
};

export default ManagerListTable;
