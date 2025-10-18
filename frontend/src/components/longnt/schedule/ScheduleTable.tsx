"use client";
import React from "react";
import { Schedule } from "@/types/type";

interface ScheduleTableProps {
  schedule: Schedule[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
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
            const isGroupTitle = !/\d/.test(item.roundName); // Kiểm tra có số trong tên không

            return (
              <tr
                key={item.id}
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
