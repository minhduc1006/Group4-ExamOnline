"use client";

import {
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
import { useState } from "react";
import React from "react";
import { Input } from "@nextui-org/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchData: () => void;
  filterUserName: string;
  setFilterUserName: (username: string) => void;
  filterRating: string;
  setFilterRating: (rating: string) => void;
  onSearch: () => void;
}

export function FeedbackDataTable<TData, TValue>({
  columns,
  data,
  fetchData,
  filterUserName,
  setFilterUserName,
  filterRating,
  setFilterRating,
  onSearch
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  });

  return (
    <div className="">

      {/* Bộ lọc */}
      <div className="w-full flex justify-start my-5 gap-4">
        <Input
          type="text"
          placeholder="tên tài khoản"
          value={filterUserName}
          onChange={(event) => setFilterUserName(event.target.value)}
          className="w-[200px] max-w-sm border border-gray-300 rounded-sm"
        />

        <select
          value={filterRating}
          onChange={(event) => {
            setFilterRating(event.target.value);
          }}
          className="w-[200px] max-w-sm border border-gray-300 rounded-sm"
        >
          <option value="">All★</option>
          <option value="5">5★</option>
          <option value="4">4★</option>
          <option value="3">3★</option>
          <option value="2">2★</option>
          <option value="1">1★</option>
        </select>

        {/* Nút tìm kiếm */}
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
        >
          Tìm Kiếm
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-md border flex w-full">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-left" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="my-3">
            {data && data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-left" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
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
    </div>
  );
}
