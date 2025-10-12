import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(2, {
      message: "Tài khoản phải có ít nhất 2 ký tự",
    }),
    password: z.string().min(4, {
      message: "Mật khẩu phải có ít nhất 4 ký tự",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Tài khoản không được bỏ trống",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được bỏ trống",
  }),
});
