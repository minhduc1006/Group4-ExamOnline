"use client";
import { changePasswordSchema } from "@/helper/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "@nextui-org/react";
import { Form, FormField } from "./ui/form";
import { useState } from "react";
import { CHANGE_PASSWORD } from "@/helper/urlPath";
import { API } from "@/helper/axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChangePasswordForm = ({ user }: any) => {
  const [formError, setFormError] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleChangePassword = async (
    data: z.infer<typeof changePasswordSchema>
  ) => {
    setFormError("");
    setNotification("⏳ Đang xử lý yêu cầu của bạn...");
    try {
      const { data: submited } = await API.put(
        `${process.env.NEXT_PUBLIC_API_URL}` + CHANGE_PASSWORD,
        {
          id: user.data.id,
          password: data.password,
          newPassword: data.newPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!submited) {
        setNotification("");
        setFormError("Sai mật khẩu");
      } else {
        form.reset({
          password: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setFormError("");
        setNotification("Đổi mật khẩu thành công");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setNotification("");
      setFormError("Hệ thống đang bận, vui lòng thử lại sau");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Đổi mật khẩu
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[600px] z-[999] bg-white"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChangePassword)}>
            <DialogHeader>
              <DialogTitle>Đổi mật khẩu</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    const error = form.formState.errors?.password;
                    return (
                      <>
                        <Label htmlFor="password" className="text-right">
                          Mật khẩu
                        </Label>
                        <Input
                          type="password"
                          placeholder="password"
                          autoComplete="password"
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
            </div>
            <div className="grid grid-cols-4">
              <div className="col-span-1"></div>
              <div className="col-span-3 flex">
                <div className="text-red-500">{formError}</div>
                {notification}
              </div>
            </div>
            <DialogFooter>
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="p-2 mt-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Đổi mật khẩu
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordForm;
