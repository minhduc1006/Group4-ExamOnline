/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
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
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { SupportRequest } from "@/types/type";
import axios from "axios";

// Component hiển thị bảng dữ liệu yêu cầu hỗ trợ
interface SupportDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  fetchData: () => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterIssueCategory: string;
  setFilterIssueCategory: (category: string) => void;
  onSearch: () => void;
}

export function SupportDataTable<TData extends SupportRequest, TValue>({
  columns,
  data,
  fetchData,
  filterStatus,
  setFilterStatus,
  filterIssueCategory,
  setFilterIssueCategory,
  onSearch,
}: SupportDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<SupportRequest | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SupportRequest | null>(null);
  const [newAnswer, setNewAnswer] = useState<string>(""); // Thêm state để lưu câu trả lời
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);

  // Cấu hình bảng từ react-table
  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  // Lấy câu trả lời hiện tại của yêu cầu hỗ trợ
  const fetchCurrentAnswer = async (id: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/support/requests/${id}/answer`
      );
      const answer =
        typeof response.data === "object"
          ? JSON.stringify(response.data)
          : response.data;
      setNewAnswer(answer); // Cập nhật câu trả lời vào state
    } catch (error) {
      console.error("Không thể lấy câu trả lời", error);
      setNewAnswer("N/A"); // Nếu có lỗi thì set về N/A
    }
  };

  const handleReply = async (rowData: SupportRequest) => {
    if (newAnswer.length < 5) {
      toast({
        title: "Câu trả lời quá ngắn!",
        className: "text-white bg-red-500",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/support/requests/${rowData.id}/answer`,
        { newAnswer: newAnswer },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        toast({
          title: "Cập nhật yêu cầu hỗ trợ thành công!",
          className: "text-white bg-green-500",
        });
        fetchData(); // Cập nhật lại bảng sau khi trả lời thành công
      } else {
        throw new Error("Không thể trả lời yêu cầu hỗ trợ.");
      }
    } catch (error) {
      toast({
        title: "Cập nhật yêu cầu hỗ trợ thất bại!",
        className: "text-white bg-red-500",
      });
    } finally {
      setOpen(false); // Đóng modal sau khi trả lời
    }
  };

  // Mở modal trả lời yêu cầu hỗ trợ
  const openReplyModal = (rowData: SupportRequest) => {
    setSelectedRow(rowData);
    fetchCurrentAnswer(rowData.id); // Đặt lại câu trả lời khi mở modal
    setOpen(true); // Mở modal trả lời
  };

  const handleSort = (columnId: string) => {
    // Kiểm tra nếu columnId là "dateCreated" thì chỉ áp dụng sắp xếp cho cột này
    if (columnId === "dateCreated") {
      setSorting((prevSorting) => {
        const isAlreadySorted = prevSorting.some((sort) => sort.id === columnId);
  
        if (!isAlreadySorted) {
          return [{ id: columnId, desc: false }];
        }
    
        // Nếu đã được sắp xếp, đổi chiều sắp xếp
        return prevSorting.map((sort) =>
          sort.id === columnId
            ? { ...sort, desc: !sort.desc }
            : sort
        );
      });
    }
  };
  

  return (
    <div className="py-10">
      {/* Bộ lọc */}
      <div className="w-full flex justify-start my-5 gap-4">
        <select
          value={filterStatus}
          onChange={(event) => {
            setFilterStatus(event.target.value);
            
          }}
          className="w-[200px] max-w-sm border border-gray-300 rounded-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="open">Đã giải quyết</option>
          <option value="close">Chưa xử lí</option>
        </select>

        <select
          value={filterIssueCategory}
          onChange={(event) => {
            setFilterIssueCategory(event.target.value);
            
          }}
          className="w-[200px] max-w-sm border border-gray-300 rounded-sm"
        >
          <option value="">Tất cả loại sự cố</option>
          <option value="account-support">Hỗ trợ tài khoản</option>
          <option value="exam-support">Hỗ trợ thi cử</option>
          <option value="payment-support">Hỗ trợ thanh toán</option>
          <option value="other">Khác</option>
        </select>

        {/* Nút tìm kiếm */}
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
        >
          Tìm Kiếm
        </button>
      </div>

      <div className="rounded-md border flex w-full">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="text-left cursor-pointer"
                    key={header.id}
                    onClick={() => handleSort(header.id)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === "desc"
                        ? " 🔽"
                        : " 🔼"
                      : null}
                  </TableHead>
                ))}
                <TableHead className="text-left">Trả lời</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
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
                      onClick={() => openReplyModal(row.original)} 
                    >
                      Trả lời
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
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white p-4 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Trả lời yêu cầu hỗ trợ
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <textarea
              value={newAnswer} 
              onChange={(e) => setNewAnswer(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập nội dung trả lời..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (selectedRow) {
                  handleReply(selectedRow); 
                }
              }}
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Gửi
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupportDataTable;
