import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(2, {
      message: "Tài khoản phải có ít nhất 2 ký tự",
    }),
    password: z
      .string()
      .min(4, { message: "Mật khẩu phải có ít nhất 4 ký tự" })
      .regex(/[A-Z]/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa",
      })
      .regex(/[a-z]/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường",
      })
      .regex(/[\W_]/, {
        message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
      })
      .regex(/\d/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ số",
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

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Không được bỏ trống" })
    .regex(/^[A-Za-zÀ-ỹ\s]+$/, {
      message: "Tên không được chứa số hoặc ký tự đặc biệt",
    })
    .refine((value) => value.trim().split(/\s+/).length >= 2, {
      message: "Tên phải có ít nhất 2 từ",
    }),
  gender: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  grade: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  province: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  district: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  ward: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  birthDate: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  educationLevel: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, {
      message: "Không được bỏ trống",
    }),
    newPassword: z
      .string()
      .min(4, { message: "Mật khẩu phải có ít nhất 4 ký tự" })
      .regex(/[A-Z]/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa",
      })
      .regex(/[a-z]/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường",
      })
      .regex(/[\W_]/, {
        message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
      })
      .regex(/\d/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ số",
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => !data.newPassword.includes(data.password), {
    message: "Mật khẩu mới không được chứa mật khẩu cũ",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });

export const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(4, { message: "Mật khẩu phải có ít nhất 4 ký tự" })
      .regex(/[A-Z]/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa",
      })
      .regex(/[a-z]/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường",
      })
      .regex(/[\W_]/, {
        message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
      })
      .regex(/\d/, {
        message: "Mật khẩu phải chứa ít nhất 1 chữ số",
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });

export const managerAccountSchema = z.object({
  username: z.string().min(2, {
    message: "Tài khoản phải có ít nhất 2 ký tự",
  }),
  password: z
    .string()
    .min(4, { message: "Mật khẩu phải có ít nhất 4 ký tự" })
    .regex(/[A-Z]/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa",
    })
    .regex(/[a-z]/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường",
    })
    .regex(/[\W_]/, {
      message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
    })
    .regex(/\d/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ số",
    }),
  email: z.string().min(1, {
    message: "Email không được bỏ trống",
  }),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(4, { message: "Mật khẩu phải có ít nhất 4 ký tự" })
    .regex(/[A-Z]/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa",
    })
    .regex(/[a-z]/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường",
    })
    .regex(/[\W_]/, {
      message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
    })
    .regex(/\d/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ số",
    }),
});

export const createUserSchema = z.object({
  username: z.string().min(2, {
    message: "Tài khoản phải có ít nhất 2 ký tự",
  }),
  password: z
    .string()
    .min(4, { message: "Mật khẩu phải có ít nhất 4 ký tự" })
    .regex(/[A-Z]/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa",
    })
    .regex(/[a-z]/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường",
    })
    .regex(/[\W_]/, {
      message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
    })
    .regex(/\d/, {
      message: "Mật khẩu phải chứa ít nhất 1 chữ số",
    }),
});

export const createSupportRequestSchema = z.object({
  name: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  email: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  issueCategory: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
  detail: z.string().min(1, {
    message: "Không được bỏ trống",
  }),
});
