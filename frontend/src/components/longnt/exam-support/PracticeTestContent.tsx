"use client";

import Image from "next/image";

const PracticeTestContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold mb-10">
        Hướng dẫn thi thử trên English Test
      </div>
      <div>
        Để tham gia Thi thử, bạn vui lòng thao tác theo các bước hướng dẫn như
        sau:
        <div className="mb-10">
          <span className="font-bold">Bước 1: </span> Đăng nhập tài khoản Học
          sinh
        </div>
      </div>
      <div>
        <Image
          src="/support/exam/anhLogin.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div className="mt-5 mb-5">
        <span className="font-bold mb-10 mt-10">Bước 2: </span>Click tính năng
        Thi thử ở đầu trang hoặc từ mục Học sinh trên Menu:
      </div>
      <div>
        <Image
          src="/support/exam/anhTT2.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div>
        <div>
          Nhấn <span className="font-bold">Bắt đầu thi</span> để vào bài
          thi.
        </div>
      </div>
    </div>
  );
};

export default PracticeTestContent;
