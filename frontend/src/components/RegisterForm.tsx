"use client";
import { signUpSchema } from "@/helper/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "./ui/form";
import { Input } from "@nextui-org/react";
import { Button } from "./ui/button";

import { REGISTER } from "@/helper/urlPath";
import { useState } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [formError, setFormError] = useState<string>("");
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setFormError("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}` + REGISTER,
        {
          username: data.username,
          password: data.password,
        }
      );
      if (response.data) {
        toast({
          title: "Đăng ký thành công",
          className: "text-white bg-green-500",
        });
        router.push("/auth/login");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFormError("Tài khoản đã tồn tại");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start w-full gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => {
            const error = form.formState.errors?.username;
            return (
              <>
                <label htmlFor="Username" style={{}}>
                  Tài khoản
                </label>
                <Input
                  type="text"
                  placeholder="username"
                  autoComplete="username"
                  errorMessage={<span className="text-red-500">{error?.message}</span>}
                  isInvalid={!!error?.message}
                  radius="sm"
                  className={`p-2 border ${
                    error?.message ? "border-red-500" : "border-gray-300"
                  } rounded-sm`}
                  {...field}
                />
              </>
            );
          }}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            const error = form.formState.errors?.password;
            return (
              <>
                <label htmlFor="Password" style={{}}>
                  Mật khẩu
                </label>
                <Input
                  type="password"
                  placeholder="password"
                  autoComplete="password"
                  errorMessage={<span className="text-red-500">{error?.message}</span>}
                  isInvalid={!!error?.message}
                  radius="sm"
                  className={`p-2 border ${
                    error?.message ? "border-red-500" : "border-gray-300"
                  } rounded-sm`}
                  {...field}
                />
              </>
            );
          }}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => {
            const error = form.formState.errors?.confirmPassword;
            return (
              <>
                <label htmlFor="confirmPassword" style={{}}>
                  Nhập lại mật khẩu
                </label>
                <Input
                  type="password"
                  placeholder="confirm password"
                  autoComplete="confirmPassword"
                  errorMessage={<span className="text-red-500">{error?.message}</span>}
                  isInvalid={!!error?.message}
                  radius="sm"
                  className={`p-2 border ${
                    error?.message ? "border-red-500" : "border-gray-300"
                  } rounded-sm`}
                  {...field}
                />
              </>
            );
          }}
        />
        <div className="flex justify-center w-full">
          {formError && (
            <p className="text-red-500 mb-2 text-center">{formError}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-orange-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-600 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
          disabled={form.formState.isSubmitting}
        >
          Đăng Ký
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
