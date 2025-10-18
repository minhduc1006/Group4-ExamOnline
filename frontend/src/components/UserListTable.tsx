"use client";

import { getUser } from "@/helper/fetchApi";
import { User } from "@/types/type";
import { useCallback, useEffect, useState } from "react";
import { DataTable } from "./UserDataTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import AddUserForm from "./AddUserForm";
import Pagination from "./longnt/articles/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "username",
    header: "Tài khoản",
  },
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
  },
  {
    accessorKey: "birthDate",
    header: "Ngày sinh",
    cell: ({ row }) => {
      const birthDate = row.original.birthDate;
      if (!birthDate) return "";

      const date = new Date(birthDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "accountType",
    header: "Loại tài khoản",
  },
];

const UserListTable = ({ role }: { role: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pageSize = 20;
  const [totalPages, setTotalPages] = useState<number>(0);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const username = searchParams.get("username") || "";
  const email = searchParams.get("email") || "";
  const [searchParam, setSearchParam] = useState<string[]>([username, email]);

  useEffect(() => {
    setSearchParam([username, email]);
  }, [username, email]);

  const updateSearchParam = (username1: string, email1: string) => {
    setSearchParam([username1, email1]);
    const params = new URLSearchParams(searchParams.toString());
    params.set("username", username1);
    params.set("email", email1);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUser(page, pageSize, searchParam[0], searchParam[1]);
      setUsers(res.users);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchParam]);

  const onPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, fetchUsers]);

  return (
    <div className="py-10">
      <div className="my-5">
        {role === "User" && (
          <AddUserForm role={role} onSuccess={() => fetchUsers()} />
        )}
      </div>

      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          <DataTable
            searchParam={searchParam}
            fetchData={fetchUsers}
            setSearchParam={updateSearchParam}
            data={users}
            columns={userColumns}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default UserListTable;
