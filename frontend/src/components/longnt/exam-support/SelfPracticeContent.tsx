/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";

const SelfPracticeContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-[25px] font-bold">Hướng dẫn làm bài tự luyện</div>
      <div>
      Để tham gia bài "TỰ LUYỆN", bạn cần phải "Đăng Nhập" tài khoản, sau khi đăng nhập màn hình sẽ hiển lên như sau:
        <div>
          <span className="font-bold">CÁCH 1: </span>  Bạn có thể chọn vào  <span className="font-bold">"TỰ LUYỆN"</span> ở menu trên cùng theo mũi tên hướng dẫn.
        </div>
      </div>
      <div>
        <Image
          src="/support/exam/anhTL1.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
      <div className="mt-5">
        <span className="font-bold ">Cách 2: </span>Bạn chọn <span className="font-bold">“Vào tự luyện ngay” </span>
      </div>
      <div>
        <Image
          src="/support/exam/anhTL2.png"
          alt="image"
          width={900}
          height={200}
        />
      </div>
     
    </div>
  );
};

export default SelfPracticeContent;