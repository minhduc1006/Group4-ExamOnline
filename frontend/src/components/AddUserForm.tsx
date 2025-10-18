"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormField } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "@nextui-org/react";
import { REGISTER } from "@/helper/urlPath";
import { z } from "zod";
import { useToast } from "./ui/use-toast";
import { createUserSchema } from "@/helper/schema";
import { API } from "@/helper/axios";

const AddUserForm = ({
  role,
  onSuccess,
}: {
  role: string;
  onSuccess: () => void;
}) => {
  const [formError, setFormError] = useState<string>("");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof createUserSchema>) => {
    setFormError("");
    try {
      const response = await API.post(
        `${process.env.NEXT_PUBLIC_API_URL}` + REGISTER,
        {
          username: data.username,
          password: data.password,
        }
      );
      if (response.data) {
        toast({
          title: "Tạo tài khoản thành công",
          className: "text-white bg-green-500",
        });
        onSuccess();
        setOpen(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFormError("Tài khoản đã tồn tại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Thêm tài khoản {role}
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[600px] z-[999] bg-white"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Thêm tài khoản</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => {
                    const error = form.formState.errors?.username;
                    return (
                      <>
                        <Label htmlFor="username" className="text-right">
                          Tên tài khoản
                        </Label>
                        <Input
                          type="text"
                          placeholder="username"
                          autoComplete="username"
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
                  name="password"
                  render={({ field }) => {
                    const error = form.formState.errors?.password;
                    return (
                      <>
                        <Label htmlFor="password" className="text-right">
                          Mật khẩu
                        </Label>
                        <Input
                          type="text"
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
            </div>
            <div className="grid grid-cols-4">
              <div className="col-span-1"></div>
              <div className="col-span-3 flex">
                <div className="text-red-500">{formError}</div>
              </div>
            </div>
            <DialogFooter>
              <button
                type="submit"
                className="p-2 mt-5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Thêm
              </button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserForm;
