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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { Input } from "@nextui-org/react";
import { Articles } from "@/types/type";
import UpdateContentForm from "./UpdateContentForm";
import Image from "next/image";
import { API } from "@/helper/axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchData: () => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterDate: string;
  setFilterDate: (date: string) => void;
  onSearch: () => void;
}

export function ContentDataTable<TData, TValue>({
  columns,
  data,
  fetchData,
  filterType,
  setFilterType,
  filterDate,
  setFilterDate,
  onSearch,
}: DataTableProps<TData, TValue>) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
  });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<Articles | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Articles | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Articles | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await API.delete(
        `${process.env.NEXT_PUBLIC_API_URL}${"/articles"}/${id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast({
        title: "Xóa bài viết thành công!",
        className: "text-white bg-green-500",
      });
      fetchData();
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Xóa bài viết thất bại!",
        className: "text-white bg-red-500",
      });
    }
  };

  const openDeleteModal = (rowData: TData) => {
    setSelectedRow(rowData as Articles);
    setOpen(true);
  };

  const openEditModal = (rowData: Articles) => {
    setSelectedArticle(rowData);
    setEditModalOpen(true);
  };

  const openDetailModal = (rowData: TData) => {
    setDetailData(rowData as Articles);
    setDetailModalOpen(true);
  };

  const handleUpdate = async () => {
    toast({
      title: "Cập nhật bài viết thành công!",
      className: "text-white bg-green-500",
    });
    fetchData();
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="w-full flex justify-start my-5 gap-4">
        <Input
          type="date"
          placeholder="Filter date.."
          value={filterDate}
          onChange={(event) => setFilterDate(event.target.value)}
          className=" w-[200px] max-w-sm border border-gray-300 rounded-sm"
        />
        <select
          value={filterType}
          onChange={(event) => {
            setFilterType(event.target.value);
          }}
          className="w-[200px] max-w-sm border border-gray-300 rounded-sm"
        >
          <option value="">Tất cả các loại</option>
          <option value="NEWS">NEWS</option>
          <option value="TIPS">TIPS</option>
        </select>

        {/* Nút "Tìm kiếm" */}
        <button
          onClick={onSearch}
          className="px-4 py-2  bg-orange-500 text-white rounded-lg hover:bg--600 transition-all"
        >
          Tìm kiếm
        </button>
      </div>
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
                <TableHead className="text-left">Chỉnh sửa</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="my-3">
            {table.getRowModel().rows?.length ? (
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
                  <TableCell className="text-left flex justify-start gap-2">
                    <button
                      type="button"
                      className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                      onClick={() => openDetailModal(row.original)}
                    >
                      Chi tiết
                    </button>

                    <button
                      type="button"
                      className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                      onClick={() => openDeleteModal(row.original)}
                    >
                      Xóa
                    </button>
                    <button
                      type="button"
                      className="p-2  bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                      onClick={() => openEditModal(row.original as Articles)}
                    >
                      Cập nhật
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
        <DialogContent className="sm:max-w-[425px] z-[999] bg-white">
          <DialogHeader>
            <DialogTitle>
              Xóa Bài Viết “
              <strong>{selectedRow ? selectedRow.title : "Chưa chọn"}</strong>”
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={() =>
                selectedRow?.id && handleDelete(selectedRow.id ?? 0)
              }
            >
              Xóa bài viết
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        {editModalOpen && selectedArticle && (
          <UpdateContentForm
            open={editModalOpen}
            initialData={{
              ...selectedArticle,
              articlesType: selectedArticle.articlesType as "NEWS" | "TIPS",
            }}
            onClose={() => setEditModalOpen(false)}
            onSuccess={handleUpdate}
          />
        )}
      </Dialog>

      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent 
        className="sm:max-w-[1000px] z-[999] bg-white max-h-[80vh] overflow-y-auto p-6"
        >
          <DialogHeader>
            <DialogTitle>Chi tiết Bài Viết</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {detailData ? (
              <>
                {detailData.imageUrl && (
                  <div className="w-full flex justify-center">
                    <Image
                      src={detailData.imageUrl}
                      alt={detailData.title}
                      width={400}
                      height={300}
                      className="rounded-md max-w-full h-auto border border-gray-300"
                      priority
                    />
                  </div>
                )}

                <p>
                  <strong>Tiêu đề:</strong> {detailData.title}
                </p>
                <p>
                  <strong>Loại:</strong> {detailData.articlesType}
                </p>
                <p>
                  <strong>Ngày đăng:</strong> {detailData.date || "N/A"}
                </p>
                <div>
                  <strong>Nội dung:</strong>
                  <div
                    className="mt-2 overflow-y-auto max-h-[60vh] break-words whitespace-pre-line p-4 border border-gray-300 rounded-md text-gray-800 text-base leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: detailData.content || "Không có nội dung",
                    }}
                  />
                </div>
              </>
            ) : (
              <p>Không có thông tin chi tiết để hiển thị.</p>
            )}
          </div>
          <DialogFooter>
            <button
              type="button"
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={() => setDetailModalOpen(false)}
            >
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
