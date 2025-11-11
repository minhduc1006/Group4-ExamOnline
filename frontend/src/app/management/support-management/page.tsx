"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import LogoIcon from "@/components/LogoIcon";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useAuth } from "@/app/AuthProvider";

import { SideBarSupport } from "@/components/longnt/support-manager/SideBarSupport";
import SupportListTable from '@/components/longnt/support-manager/SupportListTable';
import FeedbackListTable from "@/components/longnt/support-manager/FeedbackListTable";

const SupportManagerPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const { isLoading } = useAuth();

  const content = searchParams.get("content") || "Support";

  useEffect(() => {
    if (content !== "Support") {
      const newUrl = `${pathname}?content=Feedback`;
      router.replace(newUrl);
    }
  }, [content, pathname, router]);

 const renderSupportContent = () => {
    switch (content) {
      case "Support":
        return <SupportListTable />;
      case "Feedback":
        return <FeedbackListTable />
      default:
        return <SupportListTable />;
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
          <SideBarSupport />
        </div>
        <div className="px-40 w-[85%] border-l-2 border-gray-300/50 shadow-sm">
          {renderSupportContent()}
        </div>
      </div>
    </div>
  );
};

export default SupportManagerPage;
