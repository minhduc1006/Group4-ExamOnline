"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ManagerListTable from "../../../components/ManagerListTable";
import { SidebarAdmin } from "../../../components/SidebarAdmin";
import UserListTable from "../../../components/UserListTable";
import LogoIcon from "@/components/LogoIcon";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useAuth } from "@/app/AuthProvider";

const validContents = [
  "User",
  "Quiz_Manager",
  "Content_Manager",
  "Support_Manager",
];

const AdminPage = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const { isLoading } = useAuth();

  const content = searchParams.get("content") || "User";

  useEffect(() => {
    if (!validContents.includes(content)) {
      const newUrl = `${pathname}?content=User`;
      router.replace(newUrl);
    }
  }, [content, pathname, router]);

  const renderContent = () => {
    switch (content) {
      case "User":
        return <UserListTable role={content} />;
      case "Quiz_Manager":
        return <ManagerListTable role={content} />;
      case "Content_Manager":
        return <ManagerListTable role={content} />;
      case "Support_Manager":
        return <ManagerListTable role={content} />;
      default:
        return <UserListTable role={content} />;
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="flex w-[15%] bg-[#FCB314] opacity-90 p-2 items-center justify-start border-r-2 border-r-gray-300/50">
          <LogoIcon />
          <div className="font-bold text-[27px]">EduTest</div>
        </div>
        <div className="flex w-[85%] p-2 pr-10 justify-end items-center border-l-2 border-gray-300/50 border-b-2 shadow-sm">
          {!isLoading && <div className="text-[20px]">Tài khoản: {user.data?.username}</div>}
        </div>
      </div>
      <div className="flex min-h-screen">
        <div className="flex bg-[#FCB314] opacity-90 w-[15%] border-r-2 border-gray-300/50 shadow-lg">
          <SidebarAdmin />
        </div>
        <div className="px-40 w-[85%] border-l-2 border-gray-300/50 shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
