"use client";
import { newPasswordSchema } from "@/helper/schema";
import { CHANGE_PASSWORD_TOKEN, VERIFY_TOKEN } from "@/helper/urlPath";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "@nextui-org/react";

const ChangePasswordForgotForm = ({ token }: { token: string }) => {
  const [errorForm, setErrorForm] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const [validToken, setValidToken] = useState<boolean>();

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    const request = async () => {
      try {
        const { data: verified } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}${VERIFY_TOKEN}`,
          {
            token: token,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!verified) {
          throw new Error("");
        }
        setValidToken(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setErrorForm("Đường link đã hết hạn");
        setValidToken(false);
      }
    };

    request();
  }, [token]);

  const changePass = async (data: z.infer<typeof newPasswordSchema>) => {
    try {
      const { data: response } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}${CHANGE_PASSWORD_TOKEN}`,
        {
          token: token,
          password: data.newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response) {
        throw new Error("");
      }
      setNotification("Đổi mật khẩu thành công, hãy đăng nhập lại để sử dụng dịch vụ");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setNotification("Hệ thống đang bận, vui lòng thử lại sau");
    }
  };

  return (
    <>
      {!validToken && <div className="text-red-500">{errorForm}</div>}
      {validToken && (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(changePass)} className="flex flex-col gap-5">
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => {
                    const error = form.formState.errors?.newPassword;
                    return (
                      <>
                        <Label htmlFor="newPassword" className="text-right">
                          Mật khẩu mới
                        </Label>
                        <Input
                          type="password"
                          placeholder="newPassword"
                          autoComplete="newPassword"
                          errorMessage={
                            <span className="text-red-500">
                              {error?.message}
                            </span>
                          }
                          isInvalid={!!error?.message}
                          radius="sm"
                          className={`p-2 col-span-3 border ${
                            error?.message
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-sm`}
                          {...field}
                        />
                      </>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => {
                    const error = form.formState.errors?.confirmNewPassword;
                    return (
                      <>
                        <Label
                          htmlFor="confirmNewPassword"
                          className="text-right"
                        >
                          Nhập lại mật khẩu mới
                        </Label>
                        <Input
                          type="password"
                          placeholder="confirmNewPassword"
                          autoComplete="confirmNewPassword"
                          errorMessage={
                            <span className="text-red-500">
                              {error?.message}
                            </span>
                          }
                          isInvalid={!!error?.message}
                          radius="sm"
                          className={`p-2 col-span-3 border ${
                            error?.message
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-sm`}
                          {...field}
                        />
                      </>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-4 ">
                <div className="col-span-1"></div>
                <div className="col-span-3 flex">{notification}</div>
              </div>
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="p-2 mt-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Đổi mật khẩu
              </button>
              <div className="flex justify-end"></div>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default ChangePasswordForgotForm;
