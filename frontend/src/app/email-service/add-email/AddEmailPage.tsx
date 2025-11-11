"use client";
import LogoIcon from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import { ADD_MAIL } from "@/helper/urlPath";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AddEmailPage = () => {
  const [message, setMessage] = useState<string>("");
  const searchParam = useSearchParams();
  const router = useRouter();

  const email = searchParam.get("email");
  const token = searchParam.get("token");

  useEffect(() => {
    const request = async () => {
      if (!email || !token) {
        setMessage("Thêm email thất bại");
      } else {
        try {
          const { data: mailAdded } = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}${ADD_MAIL}`,
            {
              email: email,
              token: token,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (!mailAdded) {
            throw new Error("");
          }

          setMessage("Thêm email thành công");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setMessage("Thêm email thất bại");
        }
      }
    };

    request();
  }, [email, token]);

  return (
    <div className="flex flex-col items-center px-10 py-10 max-w-3xl w-full rounded-lg dark bg-white lg:p-5 bg-opacity-55 backdrop-blur-lg">
      <div>
        <LogoIcon />
      </div>
      <div>{message}</div>
      <div className="mt-5">
        <Button onClick={() => router.push("/")} className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-500 hover:scale-105 transition-all duration-300 ease-in-out">
          Trang chủ
        </Button>
      </div>
    </div>
  );
};

export default AddEmailPage;
