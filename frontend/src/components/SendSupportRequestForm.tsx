"use client";
import { useEffect, useState } from "react";
import { Form, FormField } from "./ui/form";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSupportRequestSchema } from "@/helper/schema";
import { Input } from "@nextui-org/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { SEND_SUPPORT_REQUEST } from "@/helper/urlPath";
import { useToast } from "./ui/use-toast";
import { API } from "@/helper/axios";

const SendSupportRequestForm = () => {
  const [formError, setFormError] = useState<string>("");
  const user = useCurrentUser();
  const router = useRouter();
  const {toast} = useToast();

  const form = useForm<z.infer<typeof createSupportRequestSchema>>({
    resolver: zodResolver(createSupportRequestSchema),
    defaultValues: {
      detail: "",
      email: String(user.data?.email ?? ""),
      issueCategory: "",
      name: String(user.data?.name ?? ""),
    },
  });

  useEffect(() => {
    form.reset({
      detail: form.getValues("detail"), // Lấy giá trị hiện tại của form
      email: String(user.data?.email ?? ""),
      issueCategory: form.getValues("issueCategory"),
      name: String(user.data?.name ?? ""),
    });
  }, [user.data, form]);

  const onSubmit = async (data: z.infer<typeof createSupportRequestSchema>) => {
    setFormError("");

    try {
      console.log(data);
      console.log(user.data?.username);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await API.post(
        `${process.env.NEXT_PUBLIC_API_URL}${SEND_SUPPORT_REQUEST}`,
        {
          issueCategory: data.issueCategory,
          username: user.data?.username,
          name: data.name,
          email: data.email,
          detail: data.detail
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      form.reset({
        detail: "",
        email: String(user.data?.email ?? ""),
        issueCategory: "",
        name: String(user.data?.name ?? ""),
      });
      toast({
        title: "Gửi yêu cầu hỗ trợ thành công!",
        className: "text-white bg-green-500",
      });
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFormError("Hệ thống đang bận, vui lòng thử lại sau");
    }
  };

  return (
    <div className="flex flex-col w-full p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-start w-full"
        >
          <div className="w-full flex flex-col gap-5">
            <FormField
              control={form.control}
              name="issueCategory"
              render={({ field }) => {
                const error = form.formState.errors?.issueCategory;
                return (
                  <div className="w-full flex flex-col gap-2">
                    <label htmlFor="Username">
                      <span className="text-red-500">*</span>Danh mục vấn đề
                    </label>
                    <div className="grid grid-cols-2 w-full">
                      <label
                        className={`flex items-center space-x-2 ${
                          field.value === "account-support"
                            ? "text-black"
                            : "text-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="issueCategory"
                          value="account-support"
                          checked={field.value === "account-support"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-4 h-4 "
                        />
                        <span>Hỗ trợ tài khoản</span>
                      </label>

                      <label
                        className={`flex items-center space-x-2 ${
                          field.value === "payment-support"
                            ? "text-black"
                            : "text-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="issueCategory"
                          value="payment-support"
                          checked={field.value === "payment-support"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-4 h-4 "
                        />
                        <span>Hỗ trợ thanh toán</span>
                      </label>

                      <label
                        className={`flex items-center space-x-2 ${
                          field.value === "exam-support"
                            ? "text-black"
                            : "text-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="issueCategory"
                          value="exam-support"
                          checked={field.value === "exam-support"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-4 h-4 "
                        />
                        <span>Hỗ trợ học-thi</span>
                      </label>

                      <label
                        className={`flex items-center space-x-2 ${
                          field.value === "other"
                            ? "text-black"
                            : "text-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="issueCategory"
                          value="other"
                          checked={field.value === "other"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span>Khác</span>
                      </label>

                      {error?.message && (
                        <span className="text-red-500">{error?.message}</span>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            <div className="flex flex-col">
              <label htmlFor="Username" className="mb-1">
                <span className="text-red-500">*</span>Tài khoản
              </label>
              <Input
                type="text"
                placeholder="username"
                autoComplete="username"
                radius="sm"
                value={user.data?.username}
                readOnly
                className="p-1 border bg-white border-gray-300 rounded-sm"
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                const error = form.formState.errors?.name;
                const isReadOnly = !!user.data?.name;
                return (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="Username">
                      <span className="text-red-500">*</span>Tên của bạn
                    </label>
                    <Input
                      type="text"
                      placeholder="name"
                      autoComplete="name"
                      readOnly={isReadOnly}
                      errorMessage={
                        <span className="text-red-500">{error?.message}</span>
                      }
                      isInvalid={!!error?.message}
                      radius="sm"
                      className={`p-1 border bg-white text-black  transition-colors duration-200 
                        ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } 
                        rounded-sm focus:border-black`}
                      {...field}
                    />
                  </div>
                );
              }}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                const error = form.formState.errors?.email;
                const isReadOnly = !!user.data?.email;
                return (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="Email">
                      <span className="text-red-500">*</span>Email
                    </label>
                    <Input
                      type="text"
                      placeholder="email"
                      autoComplete="email"
                      readOnly={isReadOnly}
                      errorMessage={
                        <span className="text-red-500">{error?.message}</span>
                      }
                      isInvalid={!!error?.message}
                      radius="sm"
                      className={`p-1 border bg-white text-black  transition-colors duration-200 
                        ${
                          error?.message ? "border-red-500" : "border-gray-300"
                        } 
                        rounded-sm focus:border-black`}
                      {...field}
                    />
                  </div>
                );
              }}
            />
            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => {
                const error = form.formState.errors?.detail;
                return (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="Detail">
                      <span className="text-red-500">*</span>Bạn vui lòng nêu rõ
                      vấn đề và yêu cầu hỗ trợ?
                    </label>
                    <div
                      className={`transition-all duration-200 rounded-sm w-full border 
                                ${
                                  error?.message
                                    ? "border-red-500 bg-white"
                                    : "border-none bg-none"
                                }`}
                    >
                      <textarea
                        placeholder="nhập nội dung..."
                        autoComplete="off"
                        rows={1}
                        onInput={(e) => {
                          const textarea = e.target as HTMLTextAreaElement;
                          textarea.style.height = "auto";
                          textarea.style.height = `${textarea.scrollHeight}px`;
                        }}
                        className={`px-4 py-3 border bg-white text-black
                                ${
                                  error?.message
                                    ? "border-none"
                                    : "border-gray-300"
                                } 
                               rounded-sm w-full overflow-hidden focus:outline-none`}
                        {...field}
                      ></textarea>
                      {!!error?.message && (
                        <div className="mx-2 mb-2 text-red-500">
                          {error?.message}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
          </div>
          <div className="flex justify-center w-full">
            {formError && (
              <p className="text-red-500 mb-2 text-center">{formError}</p>
            )}
          </div>
          <div className="mt-5">
            <div className="font-bold">Lưu ý:</div>
            <div>
              - Tiếp nhận và xử lý các yêu cầu trong giờ hành chính từ 8h-17h từ
              thứ 2 đến thứ 6.
            </div>
            <div>
              - Các yêu cầu gửi đến ngoài giờ hành chính sẽ được xử lý trong
              ngày làm việc kế tiếp.
            </div>
            <div>
              - Bạn cần &quot;Theo dõi phiếu&quot; để cập nhật phản hồi của
              chúng tôi.
            </div>
          </div>
          <div className="w-full flex justify-around pt-5">
            <Button
              type="submit"
              className="w-40 bg-orange-500 font-bold py-2 px-4 rounded-lg hover:bg-orange-600 text-white hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Gửi yêu cầu
            </Button>
            <Button
              type="button"
              onClick={() => {
                router.push("/support");
              }}
              className="w-40 bg-orange-500 font-bold py-2 px-4 rounded-lg hover:bg-orange-600 text-white hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Hủy
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SendSupportRequestForm;
