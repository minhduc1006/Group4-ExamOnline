"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Articles } from "@/types/type";
import { ContentDataTable } from "./ContentDataTable";
import AddContentForm from "./AddContentForm";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Pagination from "@/components/longnt/articles/Pagination"; // Import component phân trang

const apiURL = process.env.NEXT_PUBLIC_API_URL;
const GET_ARTICLES = "/articles/filtered";

// Hàm fetch dữ liệu từ API
async function getArticles(
  type: string,
  startDate: string,
  page: number,
  pageSize: number
) {
  const endDate = new Date().toISOString();
  const res = await axios.get(apiURL + GET_ARTICLES, {
    headers: { "Content-Type": "application/json" },
    params: {
      type: type || "all" ? type : undefined,
      startDate: startDate || undefined,
      endDate,
      page,
      pageSize,
    },
  });
  console.log("End Date:", endDate);
  console.log("Params:", { type, startDate, endDate });
  console.log("Fetched articles:", res.data.articles);
  console.log("Total pages:", res.data.totalPages);
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

  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || 1);

  // Cập nhật URL khi bấm "Tìm kiếm"
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (filterType !== "all") {
      params.set("type", filterType);
    } else {
      params.delete("type");
    }
    if (filterDate) {
      params.set("startDate", filterDate);
    } else {
      params.delete("startDate");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Fetch dữ liệu khi searchParams thay đổi
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const type = searchParams.get("type") || "all";
      const startDate = searchParams.get("startDate") || "";
      const page = Number(searchParams.get("page") || 1);
      const res = await getArticles(type, startDate, page, 7);
      setArticles(res.articles);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchParams]);

  return (
    <div className="py-10">
      <div className="my-5">
        <AddContentForm onSuccess={handleSearch} />
      </div>

      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          <ContentDataTable
            filterType={filterType}
            setFilterType={setFilterType}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            onSearch={handleSearch} // Gửi hàm tìm kiếm xuống component con
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
