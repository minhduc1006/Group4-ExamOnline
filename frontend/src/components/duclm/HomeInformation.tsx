"use client";
import React, { useEffect, useState } from "react";
import Slideshow from "../ui/SlideShow";
import Chatbot from "./ChatBox";

const HomeInformation: React.FC = () => {
  const images = ["/home/banner.avif"];
  const [maxLevel, setMaxLevel] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/exams/max-level")
      .then((response) => response.json())
      .then((data) => {
        setMaxLevel(data);
      })
      .catch((error) => {
        console.error("Error fetching max level:", error);
      });
  }, []);

  return (
    <div className="w-full h-full">
      <div
        className="relative w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(/home/background.webp)',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md"></div>

        {/* Giới hạn nội dung */}
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 px-8 lg:px-16 py-8 max-w-screen-xl mx-auto">
          {/* Cột 1: Tiêu đề và Button */}
          <div className="flex flex-col justify-start items-center lg:items-start space-y-4 mt-[20px] w-full lg:w-1/3">
            <div className="bg-black bg-opacity-50 p-4 text-left text-white border-l-4 border-yellow-500 pl-5">
              <div className="text-xl lg:text-2xl font-normal uppercase tracking-wide">
                CHÀO MỪNG BẠN ĐẾN VỚI
              </div>
            </div>
            <div className="bg-black bg-opacity-50 p-4 text-left text-white border-l-4 border-yellow-500 pl-5">
              <div className="text-3xl lg:text-4xl font-bold mt-2">
                TỰ LUYỆN EDUTEST VÒNG {maxLevel !== null ? maxLevel : "..."}
              </div>
            </div>
            
            {/* Button với hiệu ứng hover */}
            <div className="flex flex-col space-y-4 w-full max-w-[250px]">
              <a 
                href="/practice" 
                className="relative bg-black bg-opacity-50 text-white font-bold py-2 px-4 text-center shadow-md border-l-4 border-pink-500 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-orange-400 opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out translate-x-[-100%] group-hover:translate-x-0"></span>
                <span className="relative">Vào tự luyện ngay</span>
              </a>
              
              <a 
                href="/exam-schedule" 
                className="relative bg-black bg-opacity-50 text-white font-bold py-2 px-4 text-center shadow-md border-l-4 border-pink-500 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-orange-400 opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out translate-x-[-100%] group-hover:translate-x-0"></span>
                <span className="relative">Lịch thi EduTest</span>
              </a>
              
              <a 
                href="/news" 
                className="relative bg-black bg-opacity-50 text-white font-bold py-2 px-4 text-center shadow-md border-l-4 border-pink-500 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-orange-400 opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out translate-x-[-100%] group-hover:translate-x-0"></span>
                <span className="relative">Sự kiện</span>
              </a>
            </div>
          </div>

          {/* Cột 2: Slideshow */}
          <div className="mt-[20px] w-full lg:w-1/3">
            <Slideshow images={images} autoSlide={true} autoSlideInterval={5000}></Slideshow>
          </div>

          {/* Cột 3: Chatbox */}
          <div className="mt-[20px] w-full lg:w-1/3">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeInformation;
