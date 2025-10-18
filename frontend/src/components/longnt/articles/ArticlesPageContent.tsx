"use client";
import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import ArticlesList from "./ArticlesList";
import Image from "next/image";
import { Articles } from "@/types/type";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const ArticlesPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type") || "news";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const pageSize = 6;

  const [articles, setArticles] = useState<Articles[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  async function getArticles(
    type: string,
    page: number,
    pageSize: number
  ): Promise<{ articles: Articles[]; totalPages: number }> {
    const API_URL = `http://localhost:8080/api/v1/articles`;
    const res = await axios.get(API_URL, {
      headers: { "Content-Type": "application/json" },
      params: { type: type.toUpperCase(), page, pageSize },
    });
    return res.data;
  }

  useEffect(() => {
    setLoading(true);

    const fetchArticles = async () => {
      try {
        const data = await getArticles(type, page, pageSize);
        setArticles(data.articles || []);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        console.error("Error fetching articles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [type, page, pageSize]);

  // Xử lý sự kiện chuyển trang
  const onPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
  };

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

  const [highlightArticle, ...otherArticles] = articles;

  return (
    <div>
      {highlightArticle && (
        <Link
          key={highlightArticle.id}
          href={`/articles/${highlightArticle.id}`}
          className="block"
        >
          <div className="relative mx-auto h-auto mt-10 w-[1050px]">
            <div className="relative w-full h-60 md:h-80">
              <Image
                src={highlightArticle.imageUrl || ""}
                alt={highlightArticle.title || ""}
                layout="fill"
                objectFit="cover"
                priority
                className="opacity-80 rounded-lg"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[20%] bg-black bg-opacity-30 text-white p-3">
              <h1 className="text-xl md:text-4xl font-bold">
                {highlightArticle.title}
              </h1>
            </div>
          </div>
        </Link>
      )}

      <ArticlesList articles={otherArticles} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ArticlesPageContent;
