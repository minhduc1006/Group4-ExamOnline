/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Articles } from "@/types/type";
import axios from "axios";

interface Props {
  type: string;
}

// Hàm lấy dữ liệu gợi ý bài viết theo type
async function getSuggestedArticles(type: string): Promise<Articles[]> {
  const API_URL = `http://localhost:8080/api/v1/articles/suggestions`;

  console.log("Fetching articles with type:", type);

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

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSuggestedArticles(type);
      setSuggestedArticles(data);
    } catch (err: any) {
      console.error("Error fetching suggested articles:", err);
      setError("Error fetching articles.");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (type) {
      fetchArticles();
    }
  }, [type, fetchArticles]);

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
        <h2 className="inline-flex text-nowrap font-bold text-orange-500 bg-orange-100 border-l-4 border-orange-500 px-3 py-1">
          CÓ THỂ BẠN QUAN TÂM
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
              <div className="relative w-full md:h-[235px]">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title || "Article Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="rounded-md opacity-99 object-cover"
                    priority={index === 0}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
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