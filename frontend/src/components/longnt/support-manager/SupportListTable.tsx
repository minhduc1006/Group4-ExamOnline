"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SupportRequest } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Pagination from "@/components/longnt/articles/Pagination";
import SupportDataTable from "./SupportDataTable";

const apiURL = process.env.NEXT_PUBLIC_API_URL;
const GET_SUPPORT_REQUESTS = "/support/requests";

//Hàm fetch API - Chỉ thêm filter khi có giá trị
async function getSupportRequests(
  status?: string,
  issueCategory?: string,
  page: number = 1,
  pageSize: number = 5
) {
  const params: Record<string, string | number> = { page, pageSize };

  if (status) params.status = status;
  if (issueCategory) params.issueCategory = issueCategory;

  const res = await axios.get(`${apiURL}${GET_SUPPORT_REQUESTS}`, {
    headers: { "Content-Type": "application/json" },
    params,
  });

  return res.data;
}

const supportRequestColumns: ColumnDef<SupportRequest>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Tên Người Yêu Cầu" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "issueCategory", header: "Loại Sự Cố" },
  {
    accessorKey: "dateCreated",
    header: "Ngày Tạo",
    enableSorting: true,
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "supportAnswer",
    header: "Phản Hồi Hỗ Trợ",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              status === "open" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {status === "open" ? "Đã giải quyết" : "Chưa xử lý"}
        </div>
      );
    },
  },
];

const SupportListTable = () => {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterIssueCategory, setFilterIssueCategory] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || 1);


  const fetchSupportRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = searchParams.get("status") || undefined;
      const issueCategory = searchParams.get("issueCategory") || undefined;
      const page = Number(searchParams.get("page") || 1);

      const res = await getSupportRequests(status, issueCategory, page, 5);

      setSupportRequests(res.supportRequests);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching support requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);


  useEffect(() => {
    fetchSupportRequests();
  }, [fetchSupportRequests]);

  
  const handleSearch = () => {
    const params = new URLSearchParams();

    params.set("page", "1"); 
    if (filterStatus) {
      params.set("status", filterStatus); 
    } else {
      params.set("status", ""); 
    }

    if (filterIssueCategory) {
      params.set("issueCategory", filterIssueCategory); 
    } else {
      params.set("issueCategory", ""); 
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="py-10">
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          <SupportDataTable
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterIssueCategory={filterIssueCategory}
            setFilterIssueCategory={setFilterIssueCategory}
            onSearch={handleSearch}
            columns={supportRequestColumns}
            data={supportRequests}
            fetchData={fetchSupportRequests}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(page));
              router.push(`?${params.toString()}`, { scroll: false });
            }}
          />
        </>
      )}
    </div>
  );
};

export default SupportListTable;
