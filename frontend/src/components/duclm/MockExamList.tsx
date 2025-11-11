"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizSideBar } from "@/components/duclm/QuizSideBar";
import LogoIcon from "@/components/LogoIcon";
import { API } from "@/helper/axios"; // Use the same API helper
import MockExamListTable from "./MockExamListTable";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useAuth } from "@/app/AuthProvider";

const MockExamList = () => {
    const [mockExams, setMockExams] = useState([]); // Store the list of mock exams
    const router = useRouter();
    const user = useCurrentUser();
    const { isLoading } = useAuth();

    // Function to fetch the list of mock exams
    const refreshList = async () => {
        try {
            const response = await API.get("/mock-exam/get-all"); // Updated API endpoint
            setMockExams(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách kỳ thi giả lập:", error);
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
                    <div className="font-bold text-[27px]">English Test</div>
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
                        <h2 className="text-2xl font-bold">Danh sách kỳ thi giả lập</h2>
                    </div>

                    {/* Mock Exam Table */}
                    <MockExamListTable />
                </div>
            </div>
        </div>
    );
};

export default MockExamList;