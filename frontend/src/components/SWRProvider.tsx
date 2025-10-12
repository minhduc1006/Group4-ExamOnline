"use client";

import { API } from "@/helper/axios";
import { SWRConfig } from "swr";

export const fetcher = (url: string) => API.get(url).then((res) => res.data);

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
