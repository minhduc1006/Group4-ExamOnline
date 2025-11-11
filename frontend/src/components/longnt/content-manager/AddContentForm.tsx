/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input, Textarea } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import Image from "next/image";
import { API } from "@/helper/axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Import TinyMCE
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

// Schema kiểm tra dữ liệu nhập vào
const articleSchema = z.object({
  title: z.string().min(3, "Tiêu đề quá ngắn").max(200, "Tiêu đề quá dài"),
  content: z
    .string()
    .min(10, "Nội dung quá ngắn")
    .max(50000, "Nội dung quá dài"),
  summaryContent: z.string().min(5, "Mô tả quá ngắn").max(500, "Mô tả quá dài"),
  imageFile: z.any().optional(),
  articlesType: z.enum(["NEWS", "TIPS"]),
  date: z.string(),
});

const AddContentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    mode: "onSubmit", // Chỉ validate khi submit
    reValidateMode: "onSubmit", // Chỉ re-validate khi submit
    defaultValues: {
      title: "",
      content: "", // Khởi tạo content rỗng
      summaryContent: "",
      articlesType: "NEWS",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      form.setValue("imageFile", file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    } else {
      form.setValue("imageFile", null);
      setPreviewImage(null);
    }
  };

  const handleAddArticle = async (data: z.infer<typeof articleSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      const articleData = {
        title: data.title,
        content: data.content,
        summaryContent: data.summaryContent,
        articlesType: data.articlesType,
        date: new Date(data.date).toISOString(),
      };
      formData.append("article", JSON.stringify(articleData));
      if (data.imageFile) {
        formData.append("imageFile", data.imageFile);
      }

      const response = await API.post(`${apiURL}/articles`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status !== 201) {
        throw new Error("Lỗi khi thêm bài viết.");
      }
      toast({
        title: "Bài viết đã được lưu!",
        className: "text-white bg-green-500",
      });

      // Reset form và previewImage sau khi submit thành công
      form.reset({
        title: "",
        content: "",
        summaryContent: "",
        articlesType: "NEWS",
        date: new Date().toISOString().split("T")[0],
        imageFile: null,
      });
      setPreviewImage(null);

      onSuccess();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra khi kết nối tới máy chủ.",
        className: "text-white bg-red-500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // Không reset form để giữ nội dung, cũng không cần trigger validate ở đây
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Thêm bài viết
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] z-[999] bg-white max-h-[80vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddArticle)}>
            <DialogHeader>
              <DialogTitle>Thêm bài viết mới</DialogTitle>
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
                      maxLength={200}
                      className="w-full h-20 overflow-y-auto resize-vertical break-words border border-gray-300 rounded-md p"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      Đã nhập: {field.value?.length || 0}/200
                    </div>
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
                    <Editor
                      apiKey="ce3avywx69xjyfijnj2tt0t5vuf56s6wfxwfjw9oa48c8pvz"
                      value={field.value || ""} // Đảm bảo giá trị luôn có, tránh undefined
                      onEditorChange={(content) => {
                        field.onChange(content); // Cập nhật giá trị khi thay đổi
                      }}
                      init={{
                        height: 400,
                        menubar: true,
                        plugins:
                          "advlist autolink lists link image charmap code fullscreen media wordcount",
                        toolbar: "undo redo | bold italic | bullist numlist",
                        content_style:
                          "body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; }",
                        branding: false,
                      }}
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
                      maxLength={500}
                      className="w-full h-24 overflow-y-auto resize-vertical break-words border border-gray-300 rounded-md p p-2"
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value.length === 500) {
                          toast({
                            title: "Đã đạt giới hạn 500 ký tự!",
                            className: "text-white bg-orange-500",
                          });
                        }
                      }}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      Đã nhập: {field.value?.length || 0}/500
                    </div>
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
                name="imageFile"
                render={({}) => (
                  <div>
                    <Label htmlFor="imageFile">Chọn hình ảnh</Label>
                    <div className="items-center grid grid-cols-[auto_1fr] gap-2 mb-4">
                      <div className="h-full flex items-start">
                        <label
                          htmlFor="imageFile"
                          className="px-4 py-2 bg-white text-gray-700 border border-gray-400 rounded-md cursor-pointer hover:bg-gray-100 transition w-fit"
                        >
                          📂 Chọn tệp
                        </label>
                      </div>

                      <div className="flex-grow border border-gray-400 px-3 py-1 rounded-md text-gray-600 break-all">
                        {previewImage
                          ? previewImage
                          : "Chưa có tệp nào được chọn"}
                      </div>
                    </div>

                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {previewImage && (
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={500}
                        height={300}
                        className="mt-2 w-full h-81 object-cover rounded-lg border"
                      />
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

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="date">Ngày đăng</Label>
                    <Input
                      type="date"
                      {...field}
                      disabled
                      value={field.value}
                    />
                  </div>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="p-2 mt-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm bài viết"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentForm;