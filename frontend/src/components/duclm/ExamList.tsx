"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizSideBar } from "@/components/duclm/QuizSideBar";
import LogoIcon from "@/components/LogoIcon";
import { API } from "@/helper/axios"; 
import ExamListTable from "./ExamListTable";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useAuth } from "@/app/AuthProvider";

const ExamList = () => {
    const [exams, setExams] = useState([]); // Lưu danh sách kỳ thi
    const router = useRouter();
    const user = useCurrentUser();
    const { isLoading } = useAuth();


    // Hàm lấy danh sách kỳ thi
    const refreshList = async () => {
        try {
            const response = await API.get("/exam/get-all");
            setExams(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách kỳ thi:", error);
        }
    };

    useEffect(() => {
        refreshList();
    }, []);

    return (
        <div>
            {/* Header */}
            <div className="flex">
                <div className="flex w-[15%] bg-[#FCB314] opacity-90 p-2 items-center border-r-2 border-gray-300/50">
                    <LogoIcon />
                    <div className="font-bold text-[27px]">EduTest</div>
                </div>
                <div className="flex w-[85%] p-2 pr-10 justify-end items-center border-l-2 border-gray-300/50 border-b-2 shadow-sm">
                    {!isLoading && <div className="text-[20px]">Tài khoản: {user.data?.username}</div>}
                </div>
            </div>

            {/* Layout */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="flex bg-[#FCB314] opacity-90 w-[15%] border-r-2 border-gray-300/50 shadow-lg">
                    <QuizSideBar />
                </div>

                {/* Main Content */}
                <div className="px-10 py-6 w-[85%] border-l-2 border-gray-300/50 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Danh sách kỳ thi</h2>
                    </div>

                    {/* Exam List Table */}
                    <ExamListTable />
                </div>
            </div>
        </div>
    );
};

export default ExamList;
