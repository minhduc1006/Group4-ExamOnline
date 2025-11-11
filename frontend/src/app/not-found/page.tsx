import { IoIosWarning } from "react-icons/io";
import RouterBackButton from "@/components/RouterBackButton";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

const AccessDenied = () => {

  return (
    <div className="bg-[url('/login/bglogin2.jpg')] bg-cover bg-left bg-no-repeat flex flex-col items-center justify-center h-screen text-black">
      <span className="flex items-center">
        <IoIosWarning className="w-8 h-8 mr-4" />
        <h1 className="text-3xl font-bold">Oops! Có vẻ như bạn đang đi lạc...</h1>
      </span>
      <h3 className="mt-3">Chức năng này đang được phát triển hoặc không tồn tại</h3>
      <RouterBackButton/>
    </div>
  );
};

export default AccessDenied;