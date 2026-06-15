import z from "zod";

export const sendResetEmailSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

export const forgetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(64, { message: "New password cannot exceed 64 characters." }),
    confirmNewPassword: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(64, { message: "Confirm password cannot exceed 64 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });
