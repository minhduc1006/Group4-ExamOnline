"use client";
import { Checkbox, Input } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Form, FormField } from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/helper/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/app/AuthProvider";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [formError, setFormError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  const routes: Record<string, string> = {
    STUDENT: "/",
    ADMIN: "/management/account-management",
    QUIZ_MANAGER: "/management/quiz-management",
    SUPPORT_MANAGER: "/management/support-management",
    CONTENT_MANAGER: "/management/content-management",
  };

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setFormError("");
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await login({
        username: data.username,
        password: data.password,
        rememberMe: rememberMe,
      });

      const { data: isNewUser } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/is-new-user`,
        {
          params: { username: data.username },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await fetch("/api/auth/token");
      const { accessToken } = await res.json();
      const decoded = jwtDecode<{ scope?: string }>(accessToken);
      const scope = decoded?.scope;
      if (isNewUser === true && scope === "STUDENT") {
        router.push("/update-profile");
        return toast({
          title: "Đăng nhập thành công!",
          className: "text-white bg-green-500",
        });
      }
      router.push(routes[scope ?? ""] || "/");
      toast({
        title: "Đăng nhập thành công!",
        className: "text-white bg-green-500",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFormError("Sai tài khoản hoặc mật khẩu");
    }
  };

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

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
                <label htmlFor="Username">Tài khoản</label>
                <Input
                  type="text"
                  placeholder="username"
                  autoComplete="username"
                  errorMessage={
                    <span className="text-red-500">{error?.message}</span>
                  }
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
                <label htmlFor="Password">Mật khẩu</label>
                <Input
                  type="password"
                  placeholder="password"
                  autoComplete="password"
                  errorMessage={
                    <span className="text-red-500">{error?.message}</span>
                  }
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
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Checkbox
              color="primary"
              onChange={() => setRememberMe(!rememberMe)}
              className=""
            ></Checkbox>
            <label htmlFor="Remember me">Ghi nhớ</label>
          </div>
          <span>
            <Link className="text-blue-500" href={"/email-service/forgot"}>
              Quên mật khẩu
            </Link>
          </span>
        </div>
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
          Đăng Nhập
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
