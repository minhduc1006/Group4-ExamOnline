"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface NewsItem {
  id: number;
  date: string;
  title: string;
}

const News: React.FC = () => {
  const [events, setEvents] = useState<NewsItem[]>([]);
  const [tips, setTips] = useState<NewsItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTips, setLoadingTips] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);
  const [errorTips, setErrorTips] = useState<string | null>(null);

  // Fetch dữ liệu sự kiện
  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/articles/news/latest", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        setEvents(res.data.length > 0 ? res.data : []);
        setLoadingEvents(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setErrorEvents(err.message);
        setLoadingEvents(false);
      });
  }, []);

  // Fetch dữ liệu tips học tiếng Anh
  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/articles/tips/latest", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        setTips(res.data.length > 0 ? res.data : []);
        setLoadingTips(false);
      })
      .catch((err) => {
        console.error("Error fetching tips:", err);
        setErrorTips(err.message);
        setLoadingTips(false);
      });
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4">
      <div className="flex justify-between gap-8 max-w-screen-xl">
        {/* Sự Kiện Section */}
        <div className="flex-1 block border-2 p-4 mb-8 hover:bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-4">
            <a href="/news">SỰ KIỆN</a>
          </h2>
          {loadingEvents ? (
            <p className="text-gray-600">Đang tải tin tức...</p>
          ) : errorEvents ? (
            <p className="text-red-500">Lỗi: {errorEvents}</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500">Chưa có sự kiện nào.</p>
          ) : (
            events.map((item) => (
              <a
                key={item.id}
                href={`/news/${item.id}`}
                className="block border-b-2 border-gray-200 py-4 mb-4 hover:bg-gray-100"
              >
                <div className="text-sm text-blue-500">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="text-lg font-semibold hover:text-orange-500">{item.title}</div>
              </a>
            ))
          )}
        </div>

        {/* Tips Học Tiếng Anh Section */}
        <div className="flex-1 block border-2 p-4 mb-8 hover:bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-4">
            <a href="/tips">TIPS HỌC TIẾNG ANH</a>
          </h2>
          {loadingTips ? (
            <p className="text-gray-600">Đang tải tips...</p>
          ) : errorTips ? (
            <p className="text-red-500">Lỗi: {errorTips}</p>
          ) : tips.length === 0 ? (
            <p className="text-gray-500">Chưa có mẹo học tiếng Anh nào.</p>
          ) : (
            tips.map((item) => (
              <a
                key={item.id}
                href={`/tips/${item.id}`}
                className="block border-b-2 border-gray-200 py-4 mb-4 hover:bg-gray-100"
              >
                <div className="text-sm text-blue-500">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="text-lg font-semibold hover:text-orange-500">{item.title}</div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
