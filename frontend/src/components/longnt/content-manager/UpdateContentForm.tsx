"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Articles } from "@/types/type";

// Schema kiểm tra dữ liệu nhập vào
const articleSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Tiêu đề quá ngắn").max(100, "Tiêu đề quá dài"),
  content: z
    .string()
    .min(10, "Nội dung quá ngắn")
    .max(5000, "Nội dung quá dài"),
  summaryContent: z.string().min(5, "Mô tả quá ngắn").max(300, "Mô tả quá dài"),
  imageUrl: z.string().refine((url) => {
    return url.startsWith("/") || url.startsWith("http");
  }, "Hình ảnh phải là URL hợp lệ hoặc đường dẫn cục bộ"),
  articlesType: z.enum(["NEWS", "TIPS"]),
});

interface UpdateContentFormProps {
  initialData: z.infer<typeof articleSchema>;
  onSuccess: (updateData: Articles) => void;
  onClose: () => void;
  open: boolean;
}

const UpdateContentForm = ({
  initialData,
  onSuccess,
  onClose,
  open,
}: UpdateContentFormProps) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialData,
  });

  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const handleUpdateArticle = async (data: z.infer<typeof articleSchema>) => {
    try {
      // Gửi yêu cầu PUT với ID bài viết
      const response = await axios.put(
        `${apiURL}/articles/${initialData.id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Lỗi khi cập nhật bài viết.");
      }

      // Hiển thị thông báo thành công nếu phản hồi thành công
      toast({
        title: "Bài viết đã được cập nhật!",
        className: "text-white bg-green-500",
      });

      // Gọi callback để làm mới danh sách hoặc cập nhật trạng thái
      onSuccess(data);
      onClose();
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra khi kết nối tới máy chủ.",
        className: "text-white bg-red-500",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] z-[999] bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateArticle)}>
            <DialogHeader>
              <DialogTitle>Cập nhật bài viết</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                      {...field}
                      placeholder="Nhập tiêu đề bài viết"
                      maxLength={100}
                    />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor="content">Nội dung</Label>
                    <Textarea
                      {...field}
                      placeholder="Nhập nội dung bài viết"
                      maxLength={5000}
                    />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="summaryContent"
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor="summaryContent">Mô tả ngắn</Label>
                    <Textarea
                      {...field}
                      placeholder="Nhập mô tả ngắn của bài viết"
                      maxLength={300}
                    />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor="imageUrl">URL hình ảnh</Label>
                    <Input
                      {...field}
                      placeholder="Nhập đường dẫn hình ảnh"
                      maxLength={300}
                      onBlur={(e) => {
                        const url = e.target.value;
                        if (url.startsWith("http") || url.startsWith("/")) {
                          form.setValue("imageUrl", url);
                        }
                      }}
                    />
                    {field.value &&
                      (field.value.startsWith("http") ||
                        field.value.startsWith("/")) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={field.value}
                          alt="Preview"
                          className="mt-2 w-full h-40 object-cover rounded-lg border"
                        />
                      )}
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="articlesType"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="articlesType">Loại bài viết</Label>
                    <select
                      id="articlesType"
                      {...field}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="NEWS">NEWS</option>
                      <option value="TIPS">TIPS</option>
                    </select>
                  </div>
                )}
              />
            </div>
            <DialogFooter>
              <button
                type="submit"
                className="p-2 mt-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Cập nhật bài viết
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateContentForm;
