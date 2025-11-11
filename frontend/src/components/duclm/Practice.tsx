"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { API } from "@/helper/axios";

interface TestResult {
    smallpracticeID: number;
    testName: string;
    attempts: number;
    score: number;
    timeSpent: string;
    status: string;
}

interface UserResult {
    id: number;
    user: {
        id: number;
        name: string;
        grade: number;
    };
    practice: {
        practiceId: number;
        practiceLevel: number;
        practiceDate: string;
        grade: number;
        status: string;
    };
    totalScore: number;
    totalTime: string;
}

const Practice: React.FC = () => {
    const [maxLevel, setMaxLevel] = useState<number | null>(null);
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [userResults, setUserResults] = useState<UserResult[]>([]); // State cho kết quả người dùng
    const { toast } = useToast();
    const user = useCurrentUser();
    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    const convertToSeconds = (time: string): number => {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    useEffect(() => {
        if (!user.isLoading && user.data?.accountType === "FREE_COURSE" &&  currentLevel !== null && currentLevel > 5) {
            toast({
                title: "Bạn cần mua khóa học để tham gia tiếp tự luyện!",
                className: "text-white bg-yellow-500",
            });
            router.push("/");
        }
    }, [user.isLoading, user.data?.accountType, currentLevel]);

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

    useEffect(() => {
        if (!user.data?.id) return;

        const fetchCurrentLevel = async () => {
            try {
                const response = await API.get(`http://localhost:8080/api/v1/practice/get-practice-info/${user.data?.id}`);
                setCurrentLevel(response.data);
            } catch (error) {
                console.error("Lỗi fetch current level:", error);
            }
        };

        fetchCurrentLevel();
    }, [user.data?.id]);

    useEffect(() => {
        const checkCompletion = async () => {
            if (currentLevel === maxLevel && user.data?.id) {
                try {
                    const response = await API.get(`http://localhost:8080/api/v1/practice/latest-result/${user.data.id}`);
                    setIsCompleted(response.data);
                } catch (error) {
                    console.log(user.data?.id);
                    console.error("Error checking completion status:", error);
                }
            }
        };

        checkCompletion();
    }, [currentLevel, maxLevel, user.data?.id]);

    useEffect(() => {
        const checkUserResult = async () => {
            if (!user.data?.id || currentLevel === null) return;

            try {
                const response = await API.get(`/practice/check-result/${user.data.id}/${currentLevel}`);
                console.log(user.data.id);
                if (response.data.hasResult) {
                    console.log("User has already completed this level.");
                    window.location.reload();
                } else {
                    console.log("User has not completed this level yet.");
                }
            } catch (error) {
                console.error("Error checking user result:", error);
            }
        };

        checkUserResult();
    }, [user.data?.id, currentLevel]);

    // Fetch max level from backend
    useEffect(() => {
        const fetchMaxLevel = async () => {
            try {
                const response = await API.get("http://localhost:8080/api/v1/practice/max-level", {
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

    useEffect(() => {
        const fetchPracticeStatus = async () => {
            if (!user.data?.id) return; // Kiểm tra nếu user ID tồn tại
    
            try {
                // Gọi API để lấy thông tin practice status cho user
                const response = await API.get(`http://localhost:8080/api/v1/practice/status/${user.data.id}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
    
                const practiceData = response.data; // Dữ liệu practice trả về
    
                // Kiểm tra nếu practiceData không phải là null
                if (practiceData) {
                    // Kiểm tra trạng thái practice
                    if (practiceData.status === "off") {
                        toast({
                            title: "Vòng tự luyện đang được bảo trì, vui lòng vào lại sau!",
                            className: "text-white bg-yellow-500",
                        });
                        router.push("/");
                    }
                }
                // Nếu practiceData là null, không làm gì cả
            } catch (error) {
                console.error("Error fetching practice status:", error);
                toast({
                    title: "Có lỗi khi lấy trạng thái bài tập!",
                    className: "text-white bg-red-500",
                });
            }
        };
    
        fetchPracticeStatus();
    }, [user.data?.id]);

    // Fetch test results from backend
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

    useEffect(() => {
        if (!user.data?.id) return;

        const fetchUserResults = async () => {
            try {
                const response = await API.get(`/practice/get-result/${user.data?.id}`);
                setUserResults(response.data);
            } catch (error) {
                console.error("Error fetching user results:", error);
            }
        };

        fetchUserResults();
    }, [user.data?.id]);

    


    // Calculate total score and time spent
    const totalScore = testResults.reduce((acc, result) => acc + result.score, 0);
    const totalTimeSpent = testResults.reduce((acc, result) => acc + convertToSeconds(result.timeSpent), 0);

    const allCompleted = testResults.every(result => result.status === "Hoàn thành");
    const scoreThreshold = 75 / 100 * 300;

    const handleCompleteRound = async () => {
        try {
            await API.post("/practice/user-practice/add", { userId: user.data?.id, level: currentLevel });
            toast({ title: "Hoàn tất vòng thi thành công!", className: "text-white bg-green-500" });
        } catch (error) {
            console.error("Error completing round:", error);
            toast({ title: "Lỗi khi hoàn tất vòng thi!", className: "text-white bg-red-500" });
        }
        window.location.reload();
    };

    const handleRetryRound = async () => {
        try {
            const response = await API.delete(`/practice/test-results/delete/${currentLevel}`, {
                data: { userId: user.data?.id }
            });
            toast({ title: "Đã xóa kết quả để làm lại vòng thi!", className: "text-white bg-blue-500" });
            setTestResults([]); // Optionally clear the test results
        } catch (error) {
            console.error("Error retrying round:", error);
            toast({ title: "Lỗi khi làm lại vòng thi!", className: "text-white bg-red-500" });
        }
        window.location.reload();
    };

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
                    <div className="text-sm text-gray-500">Số vòng thi EduTest đang mở: {maxLevel}</div>
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
                                                        href={`/test/practice/${result.smallpracticeID}/${result.testName}`}
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

                        {/* Action Buttons */}
                        <div className="flex justify-center mt-6">
                            {totalScore === 0 && totalTimeSpent === 0 ? (
                                <p className="text-gray-400"></p>
                            ) : totalScore < scoreThreshold ? (
                                <button
                                    onClick={handleRetryRound}
                                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                                >
                                    Làm lại vòng thi
                                </button>
                            ) : isCompleted ? (
                                <p className="text-green-500 font-bold">Bạn đã hoàn tất toàn bộ vòng thi</p>
                            ) : (
                                <button
                                    onClick={handleCompleteRound}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Hoàn tất vòng thi
                                </button>
                            )}
                        </div>

                        <h3 className="text-lg font-semibold mt-4 mb-4">Kết quả hoàn thành các vòng thi</h3>
                        
                            {userResults.length === 0 ? (
                                <p className="text-left text-gray-400 mt-4">Bạn chưa tham gia bất kỳ vòng tự luyện nào</p>
                            ) : (
                                <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
                                <table className="min-w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-center">ID</th>
                                            <th className="px-6 py-3 text-center">Tên Người Dùng</th>
                                            <th className="px-6 py-3 text-center">Mức Thi</th>
                                            <th className="px-6 py-3 text-center">Điểm Tổng</th>
                                            <th className="px-6 py-3 text-center">Thời Gian</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {userResults.map((result) => (
                                            <tr key={result.id} className="bg-white hover:bg-gray-50">
                                                <td className="px-6 py-4">{result.id}</td>
                                                <td className="px-6 py-4">{result.user.name}</td>
                                                <td className="px-6 py-4">{result.practice.practiceLevel}</td>
                                                <td className="px-6 py-4">{result.totalScore}</td>
                                                <td className="px-6 py-4">{result.totalTime}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            )}
                        

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