"use client";
import ArticlesHeader from "@/components/longnt/articles/ArticlesHeader";
import SuggestionArticles from "@/components/longnt/articles/SuggestionArticless";
import ArticlesPageContent from "@/components/longnt/articles/ArticlesPageContent";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ArticlesPage() {
  const listType: string[] = ["news", "tips"];

  const router = useRouter();
  const param = useSearchParams();

  const type = param.get("type") || "";
  const page = param.get("page");

  useEffect(() => {
    const newParams = new URLSearchParams(param);

    let shouldUpdate = false;

    if (!listType.includes(type)) {
      newParams.set("type", "news");
      shouldUpdate = true;
    }
    if (!page) {
      newParams.set("page", "1");
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      router.replace(`?${newParams.toString()}`);
    }
  }, [param, type, router]);

  return (
    <div className="flex flex-col">
      <ArticlesHeader type={type} />
      <div className="container mx-auto p-4 flex-grow">
        <ArticlesPageContent />
      </div>
      <SuggestionArticles type={type} />
    </div>
  );
}
