"use client";

import { API } from "@/helper/axios";
import { useEffect, useState } from "react";

export interface UserExamResponse {
  examName: string;
  score: number;
  totalTime: string; // Đổi sang string để dễ format
}

export interface UserPracticeResponse {
  practiceLevel: string;
  score: number;
  totalTime: string; // Đổi sang string để dễ format
}

export interface AchievementResponse {
  exam: UserExamResponse[];
  mockExam: UserExamResponse[];
  practice: UserPracticeResponse[];
  totalTimeExam: number; // Timestamp đổi sang string ISO
  totalTimeMockExam: number;
  totalTimePractice: number;
}

const Achievements = () => {
  const [achievement, setAchievement] = useState<AchievementResponse>();

  useEffect(() => {
    const fetchAchievement = async () => {
      const response = await API.get(`/user/get-achievements`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data) {
        setAchievement(response.data);
      }
    };

    fetchAchievement();
  }, []);

  const formatSecondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="overflow-x-auto bg-white">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Tổng thời gian học-thi
        </h2>
        <table className="min-w-full text-sm text-left border text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center">Làm bài thi</th>
              <th className="px-6 py-3 text-center">Thi thử</th>
              <th className="px-6 py-3 text-center">Tự luyện</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {achievement ? (
              <tr className="bg-white hover:bg-gray-50">
                <td className="px-6 py-3 text-center">
                  {formatSecondsToTime(achievement.totalTimeExam)}
                </td>
                <td className="px-6 py-3 text-center">
                  {formatSecondsToTime(achievement.totalTimeMockExam)}
                </td>
                <td className="px-6 py-3 text-center">
                  {formatSecondsToTime(achievement.totalTimePractice)}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bảng Exam */}
      {achievement?.exam && (
        <Table
          title="Kết quả bài thi cao nhất"
          data={achievement.exam}
          headers={["Tên bài thi", "Điểm số", "Tổng thời gian"]}
        />
      )}

      {/* Bảng Mock Exam */}
      {achievement?.mockExam && (
        <Table
          title="Kết quả bài thi thử cao nhất"
          data={achievement.mockExam}
          headers={["Tên bài thi thử", "Điểm số", "Tổng thời gian"]}
        />
      )}
      {/* Bảng Practice */}
      {achievement?.practice && (
        <Table
          title="Kết quả luyện tập cao nhất"
          data={achievement.practice}
          headers={["Cấp độ", "Điểm số", "Tổng thời gian"]}
        />
      )}
    </div>
  );
};

interface TableProps {
  title: string;
  data: (UserExamResponse | UserPracticeResponse)[];
  headers: string[];
}

const Table: React.FC<TableProps> = ({ title, data, headers }) => {
  return (
    <div className="overflow-x-auto bg-white">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      <table className="min-w-full text-sm border text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {data.length > 0 ? (
            data.map((result, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50">
                {Object.values(result).map((value, i) => (
                  <td key={i} className="px-6 py-3 text-center">
                    {typeof value === "string" && value.includes("T")
                      ? new Date(value).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : value}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center py-4 text-gray-500"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Achievements;
