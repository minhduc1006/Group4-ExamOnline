"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Articles } from "@/types/type";
import axios from "axios";

interface Props {
  type: string; // news hoặc tips
}

// Hàm lấy dữ liệu gợi ý bài viết theo type
async function getSuggestedArticles(type: string): Promise<Articles[]> {
  const API_URL = `http://localhost:8080/api/v1/articles/suggestions`;
  const res = await axios.get(API_URL, {
    headers: { "Content-Type": "application/json" },
    params: { type: type.toUpperCase() },
  });
  return res.data as Articles[];
}

const SuggestionArticles: React.FC<Props> = ({ type }) => {
  const [suggestedArticles, setSuggestedArticles] = useState<Articles[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getSuggestedArticles(type);
      setSuggestedArticles(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching suggested articles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArticles();
  }, [type]);

  if (loading || error) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-[1050px]">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto w-[1050px] px-4">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold text-blue-500">
          Có thể bạn quan tâm
        </h2>
      </div>

      <div className="flex gap-4">
        {suggestedArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="block w-1/3"
          >
            <div className="flex flex-col gap-2 p-4 rounded-lg">
              <div className="relative w-full h-56">
                <Image
                  src={article.imageUrl || ""}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="rounded-md opacity-80 object-cover"
                  priority={index === 0} // chỉ ưu tiên ảnh đầu tiên
                />
              </div>
              <div className="flex justify-center mt-2">
                <h3 className="text-lg font-semibold text-center">
                  {article.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestionArticles;
