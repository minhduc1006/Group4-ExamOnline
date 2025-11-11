"use client";
import { REQUEST_FORGOT_PASSWORD } from "@/helper/urlPath";
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "@nextui-org/react";

const RequestForgotPasswordForm = () => {
  const [error, setError] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const sendMail = async () => {
    setError("");
    setNotification("⏳ Đang xử lý yêu cầu của bạn...");
    try {
      const { data: sended } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${REQUEST_FORGOT_PASSWORD}`,
        {
          username: username,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (sended === false) {
        setNotification("");
        setError("Tài khoản chưa được đăng ký email");
        return;
      }
      setError("");
      setNotification(
        "Yêu cầu đã được gửi đi, vui lòng kiểm tra email của bạn"
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setNotification("");
      setError("Tài khoản không tồn tại");
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="Username" className="text-right">
          Tên tài khoản:
        </Label>
        <Input
          radius="sm"
          className={`p-2 col-span-3 w-full border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-sm`}
          id="username"
          defaultValue=""
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <span className="col-span-1"></span>
        <div className="col-span-3 mb-3">
          <div className="text-red-500">{error}</div>
          {notification}
        </div>
      </div>
      <Button
        onClick={() => sendMail()}
        className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-500 hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Gửi yêu cầu
      </Button>
    </>
  );
};

export default RequestForgotPasswordForm;
