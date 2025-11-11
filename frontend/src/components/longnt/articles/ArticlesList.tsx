"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Articles } from "@/types/type";

interface ArticlesListProps {
  articles: Articles[];
}

const ArticlesList: React.FC<ArticlesListProps> = ({ articles }) => {
  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}`}
          className="block"
        >
          <div className="max-w-screen-xl mx-auto w-[1050px]">
            <div className="flex gap-6 p-6 rounded-lg mx-auto">
              <div className="relative w-96 h-56">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title || "Article Image"}
                    fill={true} 
                    objectFit="cover"
                    className="rounded-md bg-gray-300"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 33vw" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <p className="text-xs text-gray-400">
                  {new Date(article.date as string).toLocaleDateString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {article.summaryContent}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ArticlesList;