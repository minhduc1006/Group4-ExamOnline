"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useMemo, useState } from "react";
import {
  ADMIN_CHANGE_ACCOUNT_TYPE,
  ADMIN_CHANGE_PASS_USER,
  DELETE_USER,
} from "@/helper/urlPath";
import { useToast } from "./ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordSchema } from "@/helper/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "@nextui-org/react";
import React from "react";
import { API } from "@/helper/axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchParam: string[];
  fetchData: () => void;
  setSearchParam: (username: string, email: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchParam,
  fetchData,
  setSearchParam = () => {},
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const accountType = useMemo(
    () => ["FREE_COURSE", "FULL_COURSE", "COMBO_COURSE"],
    []
  );
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TData | null>(null);
  const { toast } = useToast();
  const [openPass, setOpenPass] = useState(false);
  const [openChange, setOpenChange] = useState(false);
  const [newAccountType, setNewAccountType] = useState<string>("");
  const [email, setEmail] = useState<string>(searchParam[1] || "");
  const [username, setUsername] = useState<string>(searchParam[0] || "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = async (id: any) => {
    console.log(id);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await API.delete(
        `${process.env.NEXT_PUBLIC_API_URL}${DELETE_USER}/${id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast({
        title: "Xóa tài khoản thành công!",
        className: "text-white bg-green-500",
      });
      fetchData();
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Xóa tài khoản thất bại!",
        className: "text-white bg-red-500",
      });
    }
  };

  const formPass = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    values: {
      password: "",
    },
  });

  const changePass = async (data: z.infer<typeof passwordSchema>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await API.post(
        `${process.env.NEXT_PUBLIC_API_URL}${ADMIN_CHANGE_PASS_USER}`,
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (selectedRow as any).id,
          password: "",
          newPassword: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast({
        title: "Đổi mật khẩu thành công!",
        className: "text-white bg-green-500",
      });
      setOpenPass(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Đổi mật khẩu thất bại!",
        className: "text-white bg-red-500",
      });
    }
  };

  const changeAccountType = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await API.put(
        `${process.env.NEXT_PUBLIC_API_URL}${ADMIN_CHANGE_ACCOUNT_TYPE}`,
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (selectedRow as any).id,
          accountType: newAccountType,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast({
        title: "Đổi loại tài khoản thành công!",
        className: "text-white bg-green-500",
      });
      fetchData();
      setOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Đổi loại tài khoản thất bại!",
        className: "text-white bg-red-500",
      });
    }
  };

  const openDeleteModal = (rowData: TData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  const openModal = (rowData: TData) => {
    setSelectedRow(rowData);
    setOpenPass(true);
  };

  const openChangeModal = (rowData: TData) => {
    setSelectedRow(rowData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setNewAccountType((rowData as any).accountType);
    setOpenChange(true);
  };

  return (
    <>
      <div className="w-full flex justify-start my-5 gap-4">
        <Input
          type="text"
          placeholder="Filter username..."
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          className="max-w-sm border border-gray-300 rounded-sm"
        />

        <Input
          type="text"
          placeholder="Filter email..."
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          className="max-w-sm border border-gray-300 rounded-sm"
        />

        <button
          type="button"
          onClick={() => setSearchParam(username, email)}
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Tìm kiếm
        </button>
      </div>
      <div className="rounded-md border flex w-full">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="text-left">STT</TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-left" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                <TableHead className="text-left">Chỉnh sửa</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="my-3">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  <TableCell className="text-left mx-5">{index + 1}</TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-left" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-left flex justify-start gap-2">
                    <button
                      type="button"
                      className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                      onClick={() => openDeleteModal(row.original)}
                    >
                      Xóa
                    </button>
                    <button
                      type="button"
                      onClick={() => openModal(row.original)}
                      className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      Đổi mật khẩu
                    </button>
                    <button
                      type="button"
                      onClick={() => openChangeModal(row.original)}
                      className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      Đổi loại tài khoản
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openChange} onOpenChange={setOpenChange}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-[425px] z-[999] bg-white"
        >
          <DialogHeader>
            <DialogTitle>
              Đổi loại tài khoản{" "}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {selectedRow ? (selectedRow as any).username : "Chưa chọn"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Loại tài khoản
              </Label>
              <select
                aria-label="Chọn loại tài khoản"
                name="accountType"
                id="accountType"
                value={newAccountType}
                onChange={(e) => setNewAccountType(e.target.value)}
                className={`p-2 col-span-3 border border-gray-300$ rounded-sm`}
              >
                {accountType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => changeAccountType()}
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Đổi loại tài khoản
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openPass} onOpenChange={setOpenPass}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-[425px] z-[999] bg-white"
        >
          <Form {...formPass}>
            <form
              onSubmit={formPass.handleSubmit(changePass)}
              className="w-full gap-4"
            >
              <DialogHeader>
                <DialogTitle>
                  Đổi mật khẩu tài khoản{" "}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {selectedRow ? (selectedRow as any).username : "Chưa chọn"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    control={formPass.control}
                    name="password"
                    render={({ field }) => {
                      const error = formPass.formState.errors?.password;
                      return (
                        <>
                          <Label htmlFor="password" className="text-right">
                            Mật khẩu
                          </Label>
                          <Input
                            type="password"
                            placeholder="password"
                            autoComplete="password"
                            errorMessage={
                              <span className="text-red-500">
                                {error?.message}
                              </span>
                            }
                            isInvalid={!!error?.message}
                            radius="sm"
                            className={`p-2 col-span-3 border ${
                              error?.message
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-sm`}
                            {...field}
                          />
                        </>
                      );
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  type="submit"
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  Đổi mật khẩu
                </button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-[425px] z-[999] bg-white"
        >
          <DialogHeader>
            <DialogTitle>
              Xóa tài khoản{" "}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {selectedRow ? (selectedRow as any).username : "Chưa chọn"}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handleDelete((selectedRow as any).id);
              }}
            >
              Xóa tài khoản
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
