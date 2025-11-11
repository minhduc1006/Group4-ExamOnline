"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { API } from "@/helper/axios";

// Define the type for the mock exam data
interface MockExamData {
  userMockExamId: number;
  examName: string;
  score: number;
  totalTime: string;
}

interface MockExam {
  mockExamId: number;
  examName: string;
}

const MockExam: React.FC = () => {
  const { toast } = useToast();
  const user = useCurrentUser();
  const router = useRouter();

  const [mockExamData, setMockExamData] = useState<MockExamData | null>(null);
  const [allMockResults, setAllMockResults] = useState<MockExamData[]>([]); // State to hold all mock results
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  // Fetch mock exam data based on the user's id and grade
  useEffect(() => {
    if (user.data?.id && user.data?.grade) {
      const fetchMockExamData = async () => {
        try {
          const response = await API.get(
            `http://localhost:8080/api/v1/user-mock-exam/latest/${user.data?.id}`
          );

          if (response.data) {
            setMockExamData(response.data);
          } else {
            setMockExamData(null);
          }
        } catch (error) {
          console.error("Error fetching mock exam data:", error);
        }
      };

      fetchMockExamData();
    }
  }, [user.data?.id, user.data?.grade]);

  useEffect(() => {
    const fetchMockExams = async () => {
      try {
        const response = await API.get(
          `/mock-exam/get-infor/${user.data?.grade}`
        );
        setMockExams(response.data);
      } catch (error) {
        console.error("Error fetching mock exams:", error);
      }
    };

    fetchMockExams();
  }, [user.data?.grade]);

  // Fetch all mock results data
  useEffect(() => {
    if (user.data?.id) {
      const fetchAllMockResults = async () => {
        try {
          const response = await API.get(
            `http://localhost:8080/api/v1/user-mock-exam/getall/${user.data?.id}`
          );

          if (response.data && response.data.length > 0) {
            setAllMockResults(response.data);
          } else {
            setAllMockResults([]);
          }
        } catch (error) {
          console.error("Error fetching all mock results:", error);
        }
      };

      fetchAllMockResults();
    }
  }, [user.data?.id]);

  useEffect(() => {
    if (!user.isLoading && !user.data?.name) {
      toast({
        title:
          "Bạn cần cập nhật thông tin cá nhân trước khi tham gia tự luyện!",
        className: "text-white bg-yellow-500",
      });

      setTimeout(() => {
        router.push("/update-profile");
      }, 500);
    }
  }, [user.data?.name, user.isLoading]);

  if (!user.data?.name) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {" "}
      {/* Ensure background covers the full height of the screen */}
      {/* Header */}
      <div className="bg-slate-200 h-28 w-full flex items-center justify-center">
        <div className="w-full max-w-7xl px-6">
          <h3 className="text-xl font-semibold">Thi thử EDUTEST</h3>
        </div>
      </div>
      {/* Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: User Information */}
          <div className="flex flex-col md:col-span-2">
            <div className="mb-4">
              <div className="text-sm">Khối tham gia: {user.data?.grade}</div>
              <h3 className="text-lg font-bold">Vào thi thử</h3>
            </div>

            {/* Dropdown for selecting test level */}
            <div className="mb-8">
              {mockExams.map((exam) => (
                <a
                  key={exam.mockExamId || exam.examName} // Sử dụng ID hoặc tên làm key
                  href={
                    exam.mockExamId
                      ? `/test/exam/mock-exam/${exam.mockExamId}?name=${exam.examName}`
                      : "#"
                  }
                  className={`bg-orange-500 text-white px-4 py-2 rounded mr-2 ${
                    exam.mockExamId
                      ? "hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={
                    exam.mockExamId ? undefined : (e) => e.preventDefault()
                  }
                >
                  {exam.examName}
                </a>
              ))}
            </div>

            {/* Exam Completion Notice */}
            <div className="bg-yellow-100 p-4 rounded-lg mb-8">
              <h4 className="text-lg font-semibold mb-4">Lưu ý:</h4>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                <li>Bạn sẽ hoàn thành bài thi thử khi:</li>
                <ul className="list-inside list-disc pl-4">
                  <li>Trả lời tất cả câu hỏi trong đề thi.</li>
                  <li>Hết thời gian làm bài.</li>
                  <li>Bấm nút "Submit" để nộp bài.</li>
                </ul>
              </ul>
            </div>

            {/* Rules on Violations */}
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
                tính một lần trượt vòng thi (trừ lượt thi và không ghi nhận kết
                quả).
              </p>
            </div>

            {/* Test Results */}
            <div className="bg-white p-4 rounded-lg mb-8">
              <h5 className="text-lg font-semibold mb-4">
                Kết quả thi mới nhất của bạn
              </h5>
              {mockExamData ? (
                <div className="overflow-x-auto shadow-lg rounded-lg bg-white mt-8">
                  <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-center">Vòng</th>
                        <th className="px-6 py-3 text-center">Tổng điểm</th>
                        <th className="px-6 py-3 text-center">
                          Tổng thời gian
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      <tr className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4">{mockExamData.examName}</td>
                        <td className="px-6 py-4">{mockExamData.score}</td>
                        <td className="px-6 py-4">{mockExamData.totalTime}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-4 text-gray-500 text-sm">
                  Chưa có dữ liệu
                </div>
              )}
            </div>

            {/* All Mock Results */}
            <div className="bg-white p-4 rounded-lg mb-8">
              <h5 className="text-lg font-semibold mb-4">
                Kết quả thi thử các cấp của {user.data.name}
                <div className="px-6 py-4 text-gray-500 text-sm">
                  {user.data.name}, Lớp {user.data.grade}, {user.data.ward}{" "}
                  {user.data.district} {user.data.province}
                </div>
              </h5>
              {allMockResults.length > 0 ? (
                <div className="overflow-x-auto shadow-lg rounded-lg bg-white mt-8">
                  <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-center">Vòng</th>
                        <th className="px-6 py-3 text-center">Số Lần Thi</th>
                        <th className="px-6 py-3 text-center">Tổng điểm</th>
                        <th className="px-6 py-3 text-center">
                          Tổng thời gian
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {allMockResults.map((result, index) => (
                        <tr key={index} className="bg-white hover:bg-gray-50">
                          <td className="px-6 py-4">{result.examName}</td>
                          <td className="px-6 py-4">{result.userMockExamId}</td>
                          <td className="px-6 py-4">{result.score}</td>
                          <td className="px-6 py-4">{result.totalTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-4 text-gray-500 text-sm">
                  Chưa có dữ liệu
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Avatar and Additional Information */}
          <div className="flex flex-col md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                Avatar
              </div>
              <div className="ml-3">
                <h4 className="text-lg font-semibold mb-2">
                  {user.data?.name}
                </h4>
                <div className="text-sm text-gray-700 mb-2">
                  ID: <span className="font-medium">{user.data?.id}</span>
                </div>
                <div className="text-sm text-gray-700">
                  Khối: <span className="font-medium">{user.data?.grade}</span>
                </div>
              </div>
            </div>

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

export default MockExam;
