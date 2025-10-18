"use client";
import axios from "axios";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { API } from "@/helper/axios";

// Định nghĩa kiểu dữ liệu cho các kết quả thi
interface TestResult {
    testName: string;
    attempts: number;
    score: number;
    timeSpent: string; 
    status: string;
}

const Practice: React.FC = () => {
    const [maxLevel, setMaxLevel] = useState<number | null>(null);
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const { toast } = useToast();
    const user = useCurrentUser();
    const router = useRouter();

    // Hàm chuyển đổi thời gian từ HH:mm:ss thành giây
    const convertToSeconds = (time: string): number => {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    useEffect(() => {
        if (!user.isLoading && !user.data?.name) {
            toast({
                title: "Bạn cần cập nhật thông tin cá nhân trước khi tham gia tự luyện!",
                className: "text-white bg-yellow-500",
            });

            setTimeout(() => {
                router.push("/update-profile");
            }, 500);
        }
    }, [user.data?.name, user.isLoading]);

    // Lấy dữ liệu currentLevel từ backend
    useEffect(() => {
        if (!user.data?.id) return;

        const fetchCurrentLevel = async () => {
            try {
                const response = await API.get(`http://localhost:8080/api/v1/practice/get-practice-info/${user.data?.id}`,);
                setCurrentLevel(response.data);
            } catch (error) {
                console.error("Lỗi fetch current level:", error);
            }
        };

        fetchCurrentLevel();
    }, [user.data?.id]);

    // Lấy dữ liệu maxLevel từ backend
    useEffect(() => {
        const fetchMaxLevel = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/v1/practice/max-level", {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                setMaxLevel(response.data);
            } catch (error) {
                console.error("Error fetching max level:", error);
            }
        };

        fetchMaxLevel();
    }, []);

    // Lấy kết quả thi từ backend
    useEffect(() => {
        if (!user.data?.id || !currentLevel) return;

        const fetchTestResults = async () => {
            try {
                const response = await API.get(
                    `http://localhost:8080/api/v1/test-results/get-test-results/${user.data?.id}/${currentLevel}`
                );
                if (!response) throw new Error("Lỗi khi lấy kết quả thi");

                const data = await response.data;
                setTestResults(data);
            } catch (error) {
                console.error("Error fetching test results:", error);
            }
        };

        fetchTestResults();
    }, [user.data?.id, currentLevel]);

    // Tính tổng điểm và tổng thời gian
    const totalScore = testResults.reduce((acc, result) => acc + result.score, 0);
    const totalTimeSpent = testResults.reduce((acc, result) => acc + convertToSeconds(result.timeSpent), 0);

    if (!user.data?.name) return null;

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-slate-200 h-28 w-full flex items-center justify-center">
                <div className="w-full max-w-7xl px-6">
                    <h3 className="text-xl font-semibold">
                        Tự luyện vòng hệ thống: {maxLevel !== null ? maxLevel : "..."}
                    </h3>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8 max-w-7xl mx-auto">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Khối bạn đang dự thi: {user.data?.grade}</h3>
                    <div className="text-sm text-gray-500">Số vòng thi IOE đang mở: {maxLevel}</div>
                    <div className="text-sm text-gray-500">Vòng thi hiện tại của bạn: {currentLevel !== null ? currentLevel : "Đang tải..."}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Rules & Notes */}
                    <div className="flex flex-col md:col-span-2">
                        <div className="bg-yellow-100 p-4 rounded-lg mb-8">
                            <h4 className="text-lg font-semibold mb-4">Lưu ý:</h4>
                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                <li>Mỗi vòng Tự luyện gồm 3 bài thi. Bạn cần đạt ít nhất 75% số điểm mỗi bài để hoàn thành.</li>
                                <li>Kết quả của một lần Tự luyện được tính bằng tổng điểm và tổng thời gian làm bài của 3 bài thi.</li>
                                <li>
                                    Sau khi hoàn thành, bạn có thể:
                                    <ul className="list-inside list-disc">
                                        <li>“Làm lại” để luyện tập lại.</li>
                                        <li>“Ghi lại kết quả” để hoàn thành và chuyển sang vòng tiếp theo.</li>
                                    </ul>
                                </li>
                                <li>
                                    Hệ thống chỉ lưu kết quả cao nhất để xét thứ hạng trong Bảng xếp hạng tuần.
                                </li>
                            </ul>
                        </div>

                        {/* Rules on Violations */}
                        <div className="bg-red-100 p-4 rounded-lg mb-8">
                            <h4 className="text-lg font-semibold mb-4">Các trường hợp thi sai luật:</h4>
                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                <li>Đăng nhập một tài khoản trên hai máy khác nhau cùng lúc.</li>
                                <li>Đang làm bài mà tải lại trang hoặc thoát ra mà không nộp bài.</li>
                                <li>Mở nhiều cửa sổ vào thi cùng lúc.</li>
                            </ul>
                            <p className="text-sm text-gray-700 mt-2">
                                Vi phạm sẽ khiến hệ thống tự động thoát ra ngoài và tính một lần trượt.
                            </p>
                        </div>

                        {/* User Score Table */}
                        <div className="overflow-x-auto shadow-lg rounded-lg bg-white mt-8">
                            <table className="min-w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-center">STT</th>
                                        <th className="px-6 py-3 text-center">Bài Thi</th>
                                        <th className="px-6 py-3 text-center">Lần Thi</th>
                                        <th className="px-6 py-3 text-center">Điểm Đã Thi</th>
                                        <th className="px-6 py-3 text-center">Thời Gian (Giây)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {testResults.map((result, index) => (
                                        <tr key={index} className="bg-white hover:bg-gray-50">
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                {result.status === "Chưa thi" ? (
                                                    <a
                                                        href="#"
                                                        className="bg-orange-300 text-white px-4 py-2 rounded hover:bg-orange-400 transition duration-300"
                                                    >
                                                        Làm {result.testName}
                                                    </a>
                                                ) : result.status === "Hoàn thành" ? (
                                                    <span className="text-orange-500 font-bold">
                                                        {result.testName} Hoàn thành
                                                    </span>
                                                ) : (
                                                    result.testName
                                                )}
                                            </td>

                                            <td className="px-6 py-4">{result.attempts === 0 ? "0" : result.attempts}</td>
                                            <td className="px-6 py-4">{result.attempts === 0 ? "0" : result.score}</td>
                                            <td className="px-6 py-4">{result.attempts === 0 ? "0" : convertToSeconds(result.timeSpent)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 hover:bg-gray-100">
                                        <td className="px-6 py-4"></td>
                                        <td className="px-6 py-4 text-red-500 font-bold">Kết Quả Thi</td>
                                        <td className="px-6 py-4"></td>
                                        <td className="px-6 py-4 text-red-500 font-bold">{totalScore}</td>
                                        <td className="px-6 py-4 text-red-500 font-bold">{totalTimeSpent}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: User Info */}
                    <div className="flex flex-col md:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                                Avatar
                            </div>
                            <div className="ml-3">
                                <h4 className="text-lg font-semibold mb-2">{user.data?.name}</h4>
                                <div className="text-sm text-gray-700 mb-2">ID: <span className="font-medium">{user.data?.id}</span></div>
                                <div className="text-sm text-gray-700">Khối: <span className="font-medium">{user.data?.grade}</span></div>
                            </div>
                        </div>

                        <div className="bg-gray-200 p-4 rounded-lg">
                            <div className="text-sm text-gray-700">
                                <div className="mb-2">Phường/Xã: <span className="font-medium">{user.data?.ward || "Chưa có"}</span></div>
                                <div className="mb-2">Quận/Huyện: <span className="font-medium">{user.data?.district || "Chưa có"}</span></div>
                                <div className="mb-2">Thành phố/Tỉnh: <span className="font-medium">{user.data?.province || "Chưa có"}</span></div>
                                <div>Vòng thi tiếp theo: <span className="font-medium">{currentLevel !== null && maxLevel !== null
                                    ? currentLevel === maxLevel
                                        ? currentLevel
                                        : currentLevel + 1
                                    : "Đang tải..."}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Practice;
