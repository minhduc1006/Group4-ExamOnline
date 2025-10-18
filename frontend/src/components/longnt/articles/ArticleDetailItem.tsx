"use client";
import React from "react";
import Image from "next/image";
import { Articles } from "@/types/type";

const ArticleDetailItem: React.FC<{ data: Articles }> = ({ data }) => {
  // Định dạng ngày
  const formattedDate = new Date(data.date as string).toLocaleDateString(
    "vi-VN",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="max-w-screen-xl mx-auto w-[1050px] p-6 mt-4">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
      <div className="relative w-full h-64 mt-4">
        <Image
          src={data.imageUrl || ""}
          alt={data.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded-md opacity-80 bg-gray-300 object-cover"
          priority
        />
      </div>
      <div className="mt-4 prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </div>
  );
};

export default ArticleDetailItem;
