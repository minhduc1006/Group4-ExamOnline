"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { API } from "@/helper/axios";
import { QuizSideBar } from "@/components/duclm/QuizSideBar";
import LogoIcon from "@/components/LogoIcon";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useAuth } from "@/app/AuthProvider";

const QuizManager = () => {
    const [data, setData] = useState<{ practiceLevel: string; userCount: number }[]>([]);
    const user = useCurrentUser();
    const { isLoading } = useAuth();

    useEffect(() => {
        API.get("http://localhost:8080/api/v1/practice/stats")
            .then((res) => setData(res.data))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    return (
        <div>
            {/* Thanh header */}
            <div className="flex">
                <div className="flex w-[15%] bg-[#FCB314] opacity-90 p-2 items-center border-r-2 border-gray-300/50">
                    <LogoIcon />
                    <div className="font-bold text-[27px]">EduTest</div>
                </div>
                <div className="flex w-[85%] p-2 pr-10 justify-end items-center border-l-2 border-gray-300/50 border-b-2 shadow-sm">
                    {!isLoading && <div className="text-[20px]">Tài khoản: {user.data?.username}</div>}
                </div>
            </div>

            {/* Layout chính */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="flex bg-[#FCB314] opacity-90 w-[15%] border-r-2 border-gray-300/50 shadow-lg">
                    <QuizSideBar />
                </div>

                {/* Nội dung chính */}
                <div className="px-10 py-6 w-[85%] border-l-2 border-gray-300/50 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Số học sinh tham gia vào các vòng tự luyện</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <XAxis
                                dataKey="level"
                                tickFormatter={(level) => `Vòng ${level}`}
                            />

                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="userCount" fill="#FFA500" barSize={50}>
                                <LabelList dataKey="practiceLevel" position="top" fill="#000" fontSize={14} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default QuizManager;
