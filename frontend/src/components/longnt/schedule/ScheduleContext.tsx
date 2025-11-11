/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Schedule } from "@/types/type";
import ScheduleTable from "./ScheduleTable";

const API_URL = "http://localhost:8080/api/v1/schedule/all";

const ScheduleContext: React.FC = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("API response data:", response.data);
        setSchedule(response.data.schedule);
      } catch (err: any) {
        console.error("Error fetching schedule:", err);
        setError(
          err.message || "An error occurred while fetching the schedule."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading || error) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-[1050px]">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[1050px] mx-auto p-6">
      {/* Phần tiêu đề */}
      <h1 className="text-3xl font-bold text-center">
        Lịch Tự luyện và các vòng Thi chính thức English Test năm học 2024-2025
      </h1>
      <p className="text-sm text-gray-500 mt-4">Th.Bảy, 22/02/2025, 23:37</p>

      {/* Bảng lịch thi */}
      <p className="font-bold mt-8">
        1. Lịch mở các vòng tự luyện và thi chính thức:
      </p>
      <ScheduleTable schedule={schedule} />

      {/* Phần mô tả trên bảng */}
      <p className="text-center text-gray-500 italic mt-4">
        (Lịch trình có thể thay đổi tùy theo thực tế và sẽ được BTC cập nhật
        trên trang chính english test)
      </p>

      {/* Phần mô tả dưới bảng */}
      <div className="mt-6">
        <p className="font-bold mt-6">
          2.{" "}
          <span className="font-normal">
            Ban Tổ chức sẽ thông báo chi tiết các khung giờ thi với từng vòng
            thi chính thức trong các bản tin sau. Các hướng dẫn về tổ chức thi
            sẽ cập nhật thường xuyên trên trang chủ.
          </span>
        </p>

        <p className="font-bold mt-4">
          3.{" "}
          <span className="font-normal">
            Các tài khoản English Test đã sử dụng trong năm học 2022–2023 cần được thay
            đổi thông tin giáo dục để phù hợp với năm học mới, bắt đầu từ{" "}
            <span className="font-bold">ngày 20-12-2024.</span> 
          </span>
        </p>

        <p className="mt-6">
          BTC cảm ơn các Sở GD&ĐT, các Phòng GD&ĐT, các Nhà trường, thầy cô
          giáo, các bậc phụ huynh và các em học sinh đã đồng hành và ủng hộ cuộc
          thi trong thời gian qua.
        </p>

        <p className="mt-4 font-normal">Trân trọng thông báo.</p>
      </div>

      {/* Phần liên hệ */}
      <div className="mt-6">
        <hr className="border-gray-300 w-1/3" />
        <p className="mt-3 text-lg font-normal">
          Mọi thông tin liên hệ với BTC xin gửi về các kênh hỗ trợ sau:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            Web hỗ trợ:{" "}
            <a
              href="http://localhost:3000/support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 underline"
            >
              hotro.englishtest.vn
            </a>
          </li>
          <li>
            Fanpage:{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500"
            >
            Thi Tiếng Anh trên Internet
            </a>
          </li>
          <li>
            Tổng đài: 1900.838.676 (hoạt động từ 8:30-17:30 từ thứ 2 đến thứ 6)
          </li>
          <li>Hotline: 0912.650.184 (hoạt động từ 18h00-21h00 T2-T6)</li>
        </ul>
      </div>
    </div>
  );
};

export default ScheduleContext;
