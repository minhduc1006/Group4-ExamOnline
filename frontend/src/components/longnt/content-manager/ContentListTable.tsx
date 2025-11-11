"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Articles } from "@/types/type";
import { ContentDataTable } from "./ContentDataTable";
import AddContentForm from "./AddContentForm";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Pagination from "@/components/longnt/articles/Pagination";

const apiURL = process.env.NEXT_PUBLIC_API_URL;
const GET_ARTICLES = "/articles/filtered";

async function getArticles(
  type?: string,
  startDate?: string,
  page: number = 1,
  pageSize: number = 10
) {
  const params: Record<string, string | number> = { page, pageSize };

  if (type) params.type = type;
  if (startDate) params.startDate = startDate;

  console.log("📌 Params sent to API:", params);

  const res = await axios.get(`${apiURL}${GET_ARTICLES}`, {
    headers: { "Content-Type": "application/json" },
    params,
  });

  console.log("✅ API Response:", res.data);
  return res.data;
}

const articleColumns: ColumnDef<Articles>[] = [
  { accessorKey: "title", header: "Tiêu đề" },
  { accessorKey: "articlesType", header: "Loại" },
  {
    accessorKey: "date",
    header: "Ngày đăng",
    cell: ({ getValue }) => getValue() || "N/A",
  },
];

const ContentListTable = () => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [filterType, setFilterType] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || 1);

  //Hàm fetch dữ liệu khi load trang hoặc khi filter thay đổi
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      //Kiểm tra nếu có filter thì lấy, nếu không thì để undefined
      const type = searchParams.get("type") || undefined;
      const startDate = searchParams.get("startDate") || undefined;
      const page = Number(searchParams.get("page") || 1);

      console.log("📌 Fetching with params:", { type, startDate, page });

      const res = await getArticles(type, startDate, page, 10);

      setArticles(res.articles);
      setTotalPages(res.totalPages);

      console.log("Total pages from API:", res.totalPages);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (filterType) params.set("type", filterType);
    if (filterDate) params.set("startDate", filterDate);
    router.push(`?${params.toString()}`, { scroll: false });
    fetchArticles();
  };

  return (
    <div className="py-10">
      <div className="my-5">
        <AddContentForm onSuccess={handleSearch} />
      </div>

      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          <div className="text-[15px] text-red-500">*Lọc từ ngày chọn đến hiện tại</div>
          <ContentDataTable
            filterType={filterType}
            setFilterType={setFilterType}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            onSearch={handleSearch}
            columns={articleColumns}
            data={articles}
            fetchData={fetchArticles}
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

export default ContentListTable;
