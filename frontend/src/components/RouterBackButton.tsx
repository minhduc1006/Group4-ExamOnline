"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const RouterBackButton = () => {
  const router = useRouter();

  return (
    <Button
      className="w-[100px] mt-10 bg-orange-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-600 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
    >
      Quay lại
    </Button>
  );
};

export default RouterBackButton;
