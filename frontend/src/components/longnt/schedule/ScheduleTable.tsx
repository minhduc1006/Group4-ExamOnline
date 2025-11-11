/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface CombinedScheduleItem {
  id: number;
  roundName: string;
  examDate?: string;
}

interface ScheduleTableProps {
  schedule: CombinedScheduleItem[]; 
}

const ScheduleTable: React.FC<ScheduleTableProps> = () => {
  const [schedule, setSchedule] = useState<CombinedScheduleItem[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/schedule/all"
        );
        const data = response.data;

        const practices = data.practices.map((practice: any) => ({
          id: practice.practiceId,
          roundName: `Practice Level ${practice.practiceLevel}`,
          examDate: practice.practiceDate,
        }));

        const exams = data.exams.map((exam: any) => ({
          id: exam.examId,
          roundName: exam.examName,
          examDate: exam.examStart,
        }));

        const combinedSchedule: CombinedScheduleItem[] = [];

        for (let i = 0; i < practices.length; i++) {
          combinedSchedule.push(practices[i]); 
          if ((i + 1) % 5 === 0 && exams.length > 0) {
            combinedSchedule.push(exams.shift()!); 
          }
        }
        combinedSchedule.push(...exams);
        setSchedule(combinedSchedule);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="w-[1050px] mx-auto overflow-x-auto mt-6">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-orange-700 text-white text-center">
            <th className="border border-gray-300 px-4 py-2">
              Vòng tự luyện/thi
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Ngày mở vòng tự luyện/thi
            </th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => {
            const isGroupTitle = !/\d/.test(item.roundName); 
            return (
              <tr
                key={`${item.id}-${isGroupTitle ? "practice" : "exam"}`} 
                className={
                  isGroupTitle
                    ? "bg-orange-700 text-white font-bold text-center"
                    : index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white"
                }
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {item.roundName}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {item.examDate
                    ? new Date(item.examDate).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
