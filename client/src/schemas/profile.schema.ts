import z from "zod";

export const MAX_BIO_LENGTH = 250;

export const profileInfoSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name is required.")
    .max(50, { message: "First name cannot exceed 50 characters." }),
  lastName: z
    .string()
    .max(50, { message: "Last name cannot exceed 50 characters." })
    .optional(),
  birthDate: z
    .date({
      error: "A date of birth is required.",
    })
    .max(new Date(), { message: "Date cannot be further than today." })
    .optional(),
  bio: z
    .string()
    .max(MAX_BIO_LENGTH, {
      message: `Bio must be at most ${MAX_BIO_LENGTH} characters.`,
    }),
});

export const securitySchema = z
  .object({
    currentPassword: z
      .string()
      .max(64, { message: "Current password cannot exceed 64 characters." })
      .optional(),
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
