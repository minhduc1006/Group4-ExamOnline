"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ArticleDetailItem from "@/components/longnt/articles/ArticleDetailItem";
import { Articles } from "@/types/type";
import ArticlesHeader from "./ArticlesHeader";
import axios from "axios";

const ArticlesPageNumber = () => {
  const { id } = useParams(); // Lấy id từ URL params
  const [data, setData] = useState<Articles | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  async function getArticleDetail(id: string): Promise<Articles> {
    const API_URL = `http://localhost:8080/api/v1/articles/${id}`;
    const res = await axios.get(API_URL, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data as Articles;
  }

  useEffect(() => {
    if (!id) return;

    const fetchArticleDetail = async () => {
      setLoading(true);
      try {
        const data = await getArticleDetail(id);
        setData(data);
      } catch (err: any) {
        console.error("Error fetching article detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ArticlesHeader type={data?.articlesType.toLowerCase() || "news"} />
      {data ? <ArticleDetailItem data={data} /> : <div>No data found</div>}
    </div>
  );
};

export default ArticlesPageNumber;
