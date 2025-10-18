import ArticlesPage from "@/components/longnt/articles/ArticlesPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
};

export default function Articles() {
  return <ArticlesPage />;
}
