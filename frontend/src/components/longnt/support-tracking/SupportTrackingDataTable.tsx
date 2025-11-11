"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { SupportRequest } from "@/types/type";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SupportTrackingDataTableProps {
  columns: ColumnDef<SupportRequest>[];
  data: SupportRequest[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export function SupportTrackingDataTable({
  columns,
  data,
  totalItems,
  currentPage,
  pageSize,
}: SupportTrackingDataTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  // Không cần slice nữa, vì backend đã phân trang
  const paginatedData = data;

  useEffect(() => {
    if (paginatedData.length > 0 && !selectedRequest) {
      setSelectedRequest(paginatedData[0]);
    }
  }, [paginatedData, selectedRequest]);

  const tableData = useMemo(
    () => (selectedRequest ? [selectedRequest] : []),
    [selectedRequest]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const openAnswerModal = (answer: string) => {
    setSelectedAnswer(answer || "Chưa có phản hồi");
    setOpen(true);
  };

  const handleSelectRequest = (request: SupportRequest) => {
    console.log("Selected request:", request);
    setSelectedRequest(request);
  };

  return (
    <div className="flex">
      <div className="w-1/5 bg-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Phiếu của tui: {totalItems}</h2>
        <div className="space-y-2 overflow-y-auto max-h-[400px]">
          {paginatedData.map((request, index) => (
            <div
              key={request.id || index}
              className={`p-2 border rounded cursor-pointer ${
                selectedRequest?.id === request.id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
              onClick={() => handleSelectRequest(request)}
            >
              Phiếu {(currentPage - 1) * pageSize + index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="w-4/5 p-4">
        <div>
          <h2 className="text-xl font-bold mb-4">Phiếu được chọn</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        className="text-left p-3 bg-gray-100"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                    <TableHead className="text-left p-3 bg-gray-100">
                      Trả lời
                    </TableHead>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="border-b">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className="text-left p-3"
                          key={cell.id}
                          style={{ width: cell.column.columnDef.size }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-left p-3">
                        <button
                          type="button"
                          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                          onClick={() =>
                            openAnswerModal(
                              row.original.supportAnswer || "Chưa có phản hồi"
                            )
                          }
                        >
                          Xem
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-24 text-center"
                    >
                      Vui lòng chọn một phiếu để xem chi tiết.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white p-4 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Câu trả lời yêu cầu hỗ trợ
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedRequest && (
              <>
                <p className="font-bold">Trả lời:</p>
                <p>{selectedAnswer}</p>
              </>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupportTrackingDataTable;