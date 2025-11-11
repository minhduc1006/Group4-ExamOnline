"use client";

import Link from "next/link";
import { useState } from "react";
import SelfPracticeContent from "./SelfPracticeContent";
import PracticeTestContent from "./PracticeTestContent";

const ExamSupportPage = () => {
  const [activeTab, setActiveTab] = useState("self-practice");

  const renderContent = () => {
    switch (activeTab) {
      case "self-practice":
        return <SelfPracticeContent />;
      case "practice-test":
        return <PracticeTestContent />;
      default:
        return <SelfPracticeContent />;
    }
  };

  return (
    <div className="w-screen flex flex-col items-center">
      {/* Header */}
      <div className="bg-slate-200 h-28 w-[100%] flex flex-col items-center drop-shadow-sm">
        <div className="w-[1050px] mt-10">
          <div className="">
            <div className="text-[20px] text-[#000000] font-medium">
              Hỗ trợ học – thi
            </div>
            <div className="text-sm custom-links text-[#505050]">
              <Link href={"/"}>Trang chủ</Link>
              <Link href={"/support"}>Hỗ trợ</Link>
              <a href={"#"}>Hỗ trợ học – thi</a>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="w-full">
        <div className="w-full flex bg-[#F0F2F5] min-h-[60vh] items-stretch">
          {/* Sidebar bên trái */}
          <div className="w-[35%] p-10 flex justify-end">
            <div className="w-[330px] flex flex-col gap-2">
              <div className="text-[20px] py-5 font-bold">Hỗ trợ học - thi</div>
              <a
                href="#"
                onClick={() => setActiveTab("self-practice")}
                className={`${
                  activeTab === "self-practice"
                    ? "text-blue-700 font-semibold"
                    : ""
                } hover:text-blue-700`}
              >
                Tự luyện
              </a>
              <a
                href="#"
                onClick={() => setActiveTab("practice-test")}
                className={`${
                  activeTab === "practice-test"
                    ? "text-blue-700 font-semibold"
                    : ""
                } hover:text-blue-700`}
              >
                Thi thử
              </a>
              
            </div>
          </div>

          {/* Nội dung bên phải */}
          <div className="w-[65%] flex flex-col pt-5 bg-white">
            <div className="p-10 flex w-[950px]">{renderContent()}</div>
            <div className="px-10 pb-10 flex flex-col w-[950px] gap-5">
              <div className="font-bold">
                Chúc các bạn học sinh thao tác thành công!
              </div>
              <div>------------------------------------------------</div>
              <div>
                <p>
                  Mọi thông tin liên quan quý vị và các em học sinh liên hệ BTC
                  qua các kênh hỗ trợ sau:
                </p>
                <p>
                  Web hỗ trợ:{" "}
                  <a
                    className="text-blue-700 underline"
                    href="http://localhost:3000/support"
                  >
                    English Test
                  </a>
                </p>
                <div>
                  Tổng đài: <span className="font-bold">0123.456.789</span>{" "}
                  (hoạt động: 08h30-21h00 T2-T6)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSupportPage;
