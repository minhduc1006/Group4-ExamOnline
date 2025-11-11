"use client";

import {
  SortingState,
  getSortedRowModel,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { useState } from "react";
import { DELETE_USER } from "@/helper/urlPath";
import { useToast } from "./ui/use-toast";
import React from "react";
import { Input } from "@nextui-org/react";
import { API } from "@/helper/axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchData: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  fetchData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TData | null>(null);
  const { toast } = useToast();

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

  const openDeleteModal = (rowData: TData) => {
    setSelectedRow(rowData);
    setOpen(true);
  };

  return (
    <>
      <div className="w-full flex justify-start my-5 gap-4">
        <Input
          type="text"
          placeholder="Filter username..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border border-gray-300 rounded-sm"
        />

        <Input
          type="text"
          placeholder="Filter email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table
              .getColumn("email")
              ?.setFilterValue(event.target.value || undefined)
          }
          className="max-w-sm border border-gray-300 rounded-sm"
        />
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
