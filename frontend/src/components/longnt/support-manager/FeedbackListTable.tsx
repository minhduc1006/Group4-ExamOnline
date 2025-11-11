"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Pagination from "@/components/longnt/articles/Pagination";
import { FeedbackDataTable } from "./FeedbackDataTable";
import { Feedback } from "@/types/type";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const GET_FEEDBACKS = "/feedback/filtered";

//Hàm fetch API Chỉ thêm filter khi có giá trị
async function getFeedbacks(
  username?: string,
  rating?: string,
  page: number = 1,
  pageSize: number = 5
) {
  const params: Record<string, string | number> = { page, pageSize };

  if (username) params.username = username;
  if (rating) params.rating = rating;

  const res = await axios.get(`${apiURL}${GET_FEEDBACKS}`, {
    headers: { "Content-Type": "application/json" },
    params,
  });

  return res.data;
}

const feedbackColumns: ColumnDef<Feedback>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "username", header: "Tài Khoản" },
  { accessorKey: "comment", header: "Bình luận" },
  { accessorKey: "rating", header: "Đánh giá sao" },
];

const FeedbackListTable = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [filterUserName, setFilterUserName] = useState<string>("");
  const [filterRating, setFilterRating] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || 1);

  //Hàm fetch dữ liệu khi load trang hoặc khi filter thay đổi
  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const userName = searchParams.get("username") || undefined;
      const rating = searchParams.get("rating") || undefined;
      const page = Number(searchParams.get("page") || 1);

      const res = await getFeedbacks(userName, rating, page, 5);

      console.log(res);

      setFeedbacks(res.userFeedbackResponses);
      if (averageScore === 0 || (filterRating === "")) {
        setAverageScore(res.averageScore);
      }
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  //Hàm cập nhật URL khi bấm "Tìm kiếm"
  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");

    if (filterUserName) {
      params.set("username", filterUserName);
    } else {
      params.delete("username");
    }
    if (filterRating && filterRating !== "All★") {
      params.set("rating", filterRating);
    } else {
      params.delete("rating");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="py-10">
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          <div className="">
            <span className="font-bold text-xl">Average Rating: </span>
            <span>{averageScore.toFixed(2)}/5</span>
          </div>

          <FeedbackDataTable
            columns={feedbackColumns}
            data={feedbacks}
            fetchData={fetchFeedbacks}
            filterUserName={filterUserName}
            setFilterUserName={setFilterUserName}
            filterRating={filterRating}
            setFilterRating={setFilterRating}
            onSearch={handleSearch}
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

export default FeedbackListTable;
