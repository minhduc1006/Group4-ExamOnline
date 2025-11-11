"use client";

import { useAuth } from "@/app/AuthProvider";
import { BarChart, FileText, FileSpreadsheet, LogOut, BookOpenCheck, ScrollText } from "lucide-react";

const quizItems = [
  {
    title: "Trang chủ",
    url: "/management/quiz-management",
    icon: BarChart,
  },
  {
    title: "Tự luyện",
    url: "/management/quiz-management/practice",
    icon: ScrollText,
  },
  {
    title: "Thi thử",
    url: "/management/quiz-management/mock-exam",
    icon: BookOpenCheck,
  },
  {
    title: "Thi Chính Thức",
    url: "/management/quiz-management/exam",
    icon: BookOpenCheck,
  },
];

export function QuizSideBar() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col px-5 pt-10 bg-[#FCB314] min-h-screen w-full shadow-lg">
      <div className="mb-10 text-xl px-2">Quản lý bài thi</div>
      {quizItems.map((item, index) => {
        const Icon = item.icon;
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

      {/* Logout Button */}
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
