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
import axios from "axios";
import dynamic from "next/dynamic";
import React from "react";

// Import TinyMCE
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

// Schema kiểm tra dữ liệu nhập vào
const articleSchema = z.object({
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
  date: z.string(),
});

const AddContentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  // const [formError, setFormError] = useState<string>("");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      summaryContent: "",
      imageUrl: "",
      articlesType: "NEWS",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const handleAddArticle = async (data: z.infer<typeof articleSchema>) => {
    try {
      const response = await axios.post(apiURL + "/articles", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Nếu response trả về mã trạng thái không thành công, hiển thị lỗi
      if (response.status !== 201) {
        throw new Error("Lỗi khi thêm bài viết.");
      }

      // Hiển thị thông báo thành công nếu phản hồi thành công
      toast({
        title: "Bài viết đã được lưu!",
        className: "text-white bg-green-500",
      });

      // Gọi callback để làm mới danh sách hoặc cập nhật trạng thái
      onSuccess();
      setOpen(false);
    } catch (error) {
      // Xử lý lỗi mạng hoặc lỗi không mong muốn khác
      toast({
        title: "Có lỗi xảy ra khi kết nối tới máy chủ.",
        className: "text-white bg-red-500",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Thêm bài viết
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] z-[999] bg-white">
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
                    <Editor
                      apiKey="ce3avywx69xjyfijnj2tt0t5vuf56s6wfxwfjw9oa48c8pvz"
                      value={field.value}
                      onEditorChange={(content) => {
                        field.onChange(content);
                      }}
                      init={{
                        height: 400,
                        menubar: true,
                        language: "vi",
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "code",
                          "fullscreen",
                          "media",
                          "searchreplace",
                          "visualblocks",
                          "wordcount",
                        ],
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline | " +
                          "alignleft aligncenter alignright | bullist numlist outdent indent | link image media table | searchreplace visualblocks wordcount",
                        content_style:
                          "body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; direction: ltr; text-align: left; }",
                        directionality: "ltr",
                        forced_root_block: "p",
                        entity_encoding: "raw",
                        convert_urls: false,
                        verify_html: false,
                        allow_script_urls: true,
                        extended_valid_elements: "*[*]",
                        valid_children: "+body[style]",
                        setup: (editor) => {
                          editor.on("init", () => {
                            editor.setContent(field.value || "");
                            const editorIframe = document.querySelector(
                              ".tox-edit-area__iframe"
                            );
                            if (editorIframe) {
                              try {
                                const iframeDoc = (
                                  editorIframe as HTMLIFrameElement
                                ).contentDocument;
                                if (iframeDoc) {
                                  const body = iframeDoc.body;
                                  body.style.direction = "ltr";
                                  body.style.textAlign = "left";
                                }
                              } catch (e) {
                                console.error("Error setting editor styles", e);
                              }
                            }
                          });
                        },
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

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="date">Ngày đăng</Label>
                    <Input type="date" {...field} />
                  </div>
                )}
              />
            </div>
            <DialogFooter>
              <button
                type="submit"
                className="p-2 mt-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Thêm bài viết
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentForm;
