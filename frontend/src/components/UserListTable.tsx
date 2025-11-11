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
  {
    accessorKey: "isLocked",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.isLocked;
      return (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              status === false ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {status === false ? "OK" : "Bị khóa"}
        </div>
      );
    },
  },
];

const UserListTable = ({ role }: { role: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const username = searchParams.get("username") || "";
  const email = searchParams.get("email") || "";
  const accountType = searchParams.get("accountType") || "";
  const sort = searchParams.get("sort") || "";
  const [searchParam, setSearchParam] = useState<string[]>([
    username,
    email,
    accountType,
    sort,
  ]);

  useEffect(() => {
    setSearchParam([username, email, accountType, sort]);
  }, []);

  const updateSearchParam = (
    username1: string,
    email1: string,
    accountType1: string,
    sort1: string
  ) => {
    setSearchParam([username1, email1, accountType1, sort1]);
    const params = new URLSearchParams(searchParams.toString());
    params.set("username", username1);
    params.set("email", email1);
    params.set("accountType", accountType1);
    params.set("sort", sort1);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUser(
        page,
        pageSize,
        searchParam[0],
        searchParam[1],
        searchParam[2],
        searchParam[3]
      );
      setUsers(res.users);
      setTotalPages(res.totalPages);
      setTotalStudents(res.totalItems);
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
      <div className="flex">
        <p>Tổng số lượng tài khoản Student: {totalStudents}</p>
      </div>

      <div className="my-5">
        {role === "Student" && (
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
