"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/helper/axios";
import Link from "next/link";

interface ExamData {
  examId: number;
  examStart: string;
  examEnd: string;
  examName: string;
  grade: number;
  status: string;
}

interface ExamResult {
  examName: string;
  score: number;
  totalTime: string;
}

const Exam: React.FC = () => {
  const { toast } = useToast();
  const user = useCurrentUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    async function fetchExamData() {
      try {
        const response = await axios.get<ExamData>(
          "http://localhost:8080/api/v1/exam/next",
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setExamData(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExamData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!examData) {
      toast({
        title: "Hiện tại không có bài thi nào.",
        className: "text-white bg-orange-500",
      });

      setTimeout(() => {
        router.push("/");
      }, 300);

      return;
    }

    if (user.data?.accountType === "FREE_COURSE") {
      router.push("/");
      setTimeout(() => {
        toast({
          title: "Bạn không có quyền truy cập vào vòng thi chính thức.",
          className: "text-white bg-yellow-500",
        });
      }, 300);
      return;
    }

    if (examData?.examStart && examData?.examEnd) {
      const startTime = new Date(examData.examStart).getTime();
      const endTime = new Date(examData.examEnd).getTime();
      if (Date.now() < startTime) {
        router.push("/");
        setTimeout(() => {
          toast({
            title:
              "Chưa đến giờ thi, vui lòng quay lại sau hoặc kiểm tra lịch thi của bạn!",
            className: "text-white bg-yellow-500",
          });
        }, 300);
        return;
      } else if (Date.now() > endTime) {
        router.push("/");
        setTimeout(() => {
          toast({
            title: "Bài thi đã kết thúc, bạn không thể vào thi nữa!",
            className: "text-white bg-yellow-500",
          });
        }, 300);
      }
    }

    if (user.data?.id && examData?.examName) {
      fetchExamResult(user.data.id.toString(), examData.examName);
      checkUserEligibility();
    }
  }, [isLoading, user.data?.accountType, user.data?.id, examData]);

  async function fetchExamResult(userId: string, examName: string) {
    try {
      const response = await API.get<ExamResult>(
        `http://localhost:8080/api/v1/user-exam/get-result/${userId}?examName=${examName}`
      );
      setExamResult(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error("No previous exam result found.");
    }
  }

  async function checkUserEligibility() {
    const examName = examData?.examName;
    const userId = user.data?.id; // Lưu user.data?.id vào biến trước

    if (!examName || userId === undefined) return; // Kiểm tra userId trước khi tiếp tục

    let previousExamName = "";
    let limit = 0;

    if (examName === "Cấp Quận/Huyện") {
      previousExamName = "Cấp Phường/Xã";
      limit = 40;
    } else if (examName === "Cấp Tỉnh/Thành Phố") {
      previousExamName = "Cấp Quận/Huyện";
      limit = 200;
    } else {
      return;
    }

    const url = `http://localhost:8080/api/v1/user-exam/get-users/${limit}?examName=${previousExamName}`;

    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      const userList = response.data;

      console.log("User List: ", userList);
      console.log("Current User ID: ", userId);
      // Kiểm tra nếu user không nằm trong danh sách đủ điều kiện
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !userList.some((u: any) => u.user.id.toString() === userId.toString())
      ) {
        toast({
          title: `Bạn chưa đủ điều kiện để thi vòng ${examName}!`,
          description: `Bạn cần đạt đủ điều kiện là Top ${limit} ở vòng ${previousExamName} để tiếp tục.`,
          className: "text-white bg-orange-500",
        });
        // Chuyển trang về trang chủ
        setTimeout(() => {
          router.push("/");
        }, 300);
      }
    } catch (error) {
      console.error(`Error fetching top users for ${previousExamName}:`, error);
    }
  }

  if (
    isLoading ||
    (examData?.examStart && Date.now() < new Date(examData.examStart).getTime())
  ) {
    return (
      <div className="h-screen flex justify-center items-center text-lg">
        Đang kiểm tra thông tin thi...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-200 h-28 w-full flex items-center justify-center">
        <div className="w-full max-w-7xl px-6">
          <h3 className="text-xl font-semibold">
            Vòng thi chính thức EduTest {examData?.examName}
          </h3>
        </div>
      </div>
      {/* Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: User Information & Exam Rules */}
          <div className="flex flex-col md:col-span-2">
            <div className="mb-4">
              <div className="text-sm">Khối tham gia: {examData?.grade}</div>
              <h3 className="text-lg font-bold">Vòng thi chính thức</h3>
            </div>
            {/* Exam Rules */}
            <div className="bg-yellow-100 p-4 rounded-lg mb-8">
              <h4 className="text-lg font-semibold mb-4">Lưu ý:</h4>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                <li>Bạn sẽ hoàn thành bài thi thử khi:</li>
                <ul className="list-inside list-disc pl-4">
                  <li>Trả lời tất cả câu hỏi trong đề thi.</li>
                  <li>Hết thời gian làm bài.</li>
                  <li>Bấm nút &quot;Submit&quot; để nộp bài.</li>
                </ul>
              </ul>
            </div>
            {/* Exam Violations */}
            <div className="bg-red-100 p-4 rounded-lg mb-8">
              <h4 className="text-lg font-semibold mb-4">
                Các trường hợp thi sai luật:
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                <li>
                  Đăng nhập một tài khoản trên hai máy hoặc hai trình duyệt khác
                  nhau và thi cùng một thời điểm.
                </li>
                <li>
                  Đang làm bài thi mà tải lại trang đề thi hoặc thoát ra không
                  nộp bài.
                </li>
                <li>Mở nhiều cửa sổ vào thi một lúc.</li>
              </ul>
              <p className="text-sm text-gray-700 mt-2">
                Các tài khoản vi phạm sẽ bị hệ thống tự động thoát ra ngoài và
                tính một lần trượt vòng thi.
              </p>
            </div>
            {/* Exam Results or Start Exam Button */}
            {examResult ? (
              <div className="overflow-x-auto shadow-lg rounded-lg bg-white mt-8">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-center">Vòng</th>
                      <th className="px-6 py-3 text-center">Tổng điểm</th>
                      <th className="px-6 py-3 text-center">Tổng thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-6 py-4">{examResult.examName}</td>
                      <td className="px-6 py-4">{examResult.score}</td>
                      <td className="px-6 py-4">{examResult.totalTime}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  href={`/test/exam/exam/${examData?.examId}?name=${examData?.examName}`}
                >
                  <button className="bg-orange-500 text-white px-3 py-1.5 rounded w-fit hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out">
                    Vào thi ngay
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Avatar and Additional Information */}
          <div className="flex flex-col md:col-span-1">
            {/* User Avatar & Info */}
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                Avatar
              </div>
              <div className="ml-3">
                <h4 className="text-lg font-semibold mb-2">
                  {user.data?.name || "Người dùng"}
                </h4>
                <div className="text-sm text-gray-700 mb-2">
                  ID:{" "}
                  <span className="font-medium">{user.data?.id || "N/A"}</span>
                </div>
                <div className="text-sm text-gray-700">
                  Khối:{" "}
                  <span className="font-medium">
                    {user.data?.grade || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            {/* Additional User Info */}
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="text-sm text-gray-700">
                <div className="mb-2">
                  Phường/Xã:{" "}
                  <span className="font-medium">
                    {user.data?.ward || "Chưa có"}
                  </span>
                </div>
                <div className="mb-2">
                  Quận/Huyện:{" "}
                  <span className="font-medium">
                    {user.data?.district || "Chưa có"}
                  </span>
                </div>
                <div className="mb-2">
                  Thành phố/Tỉnh:{" "}
                  <span className="font-medium">
                    {user.data?.province || "Chưa có"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
