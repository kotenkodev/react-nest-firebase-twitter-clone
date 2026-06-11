import z from "zod";

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(64, { message: "Password cannot exceed 64 characters." }),
});

export const signUpSchema = z
  .object({
    email: z.email("Please enter a valid email address."),
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters.")
      .max(50, { message: "First name cannot exceed 50 characters." }),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters.")
      .max(50, { message: "Last name cannot exceed 50 characters." })
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(64, { message: "Current password cannot exceed 64 characters." }),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(64, { message: "Confirm password cannot exceed 64 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
