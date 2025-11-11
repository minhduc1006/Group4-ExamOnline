"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import LogoIcon from "@/components/LogoIcon";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useAuth } from "@/app/AuthProvider";

import { SidebarContent } from "@/components/longnt/content-manager/SidebarContent";
import ContentListTable from "@/components/longnt/content-manager/ContentListTable";

const validContents = [
  "Articles",
  // "Schedule",
];

const ContentManagerPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const { isLoading } = useAuth();

  const content = searchParams.get("content") || "Articles";

  useEffect(() => {
    if (!validContents.includes(content)) {
      const newUrl = `${pathname}?content=Articles`;
      router.replace(newUrl);
    }
  }, [content, pathname, router]);

  const renderContent = () => {
    switch (content) {
      case "Articles":
        return <ContentListTable role={content} />;
      //   case "Schedule":
      //     return <ManagerListTable role={content} />;
      default:
        return <ContentListTable role="Articles" />;
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="flex w-[15%] bg-[#FCB314] opacity-90 p-2 items-center justify-start border-r-2 border-r-gray-300/50">
          <LogoIcon />
          <div className="font-bold text-[27px]">English Test</div>
        </div>
        <div className="flex w-[85%] p-2 pr-10 justify-end items-center border-l-2 border-gray-300/50 border-b-2 shadow-sm">
          {!isLoading && (
            <div className="text-[20px]">Tài khoản: {user.data?.username}</div>
          )}
        </div>
      </div>
      <div className="flex min-h-screen">
        <div className="flex bg-[#FCB314] opacity-90 w-[15%] border-r-2 border-gray-300/50 shadow-lg">
          <SidebarContent />
        </div>
        <div className="px-40 w-[85%] border-l-2 border-gray-300/50 shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ContentManagerPage;
