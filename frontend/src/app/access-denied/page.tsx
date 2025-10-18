import { IoIosWarning } from "react-icons/io";
import RouterBackButton from "@/components/RouterBackButton";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied",
};

const AccessDenied = () => {

  return (
    <div className="bg-[url('/login/bglogin2.jpg')] bg-cover bg-left bg-no-repeat flex flex-col items-center justify-center h-screen text-black">
      <span className="flex items-center">
        <IoIosWarning className="w-8 h-8 mr-4" />
        <h1 className="text-3xl font-bold">Truy cập bị từ chối!</h1>
      </span>
      <h3 className="mt-3">Bạn không có quyền truy cập đường dẫn này</h3>
      <RouterBackButton/>
    </div>
  );
};

export default AccessDenied;
