"use client";

import { useAuth } from "@/app/AuthProvider";
import { User, FileText, HelpCircle, LifeBuoy, LogOut } from "lucide-react";

const items = [
  {
    title: "Articles",
    url: "/content-manager?content=Articles",
    icon: FileText,
  },
];

export function SidebarContent() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col px-5 pt-10">
      <div className="mb-10 text-xl px-2">Quản lý nội dung</div>
      {items.map((item, index) => {
        const Icon = item.icon; // Lấy icon từ item
        return (
          <a
            key={index}
            href={item.url}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <Icon className="w-5 h-5" />
            <span>{item.title}</span>
          </a>
        );
      })}
      <a
        href="#"
        onClick={() => logout()}
        className="flex mt-10 items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span>Đăng xuất</span>
      </a>
    </div>
  );
}
