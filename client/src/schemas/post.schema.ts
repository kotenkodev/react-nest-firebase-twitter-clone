import z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .max(150, { message: "Title cannot exceed 150 characters." }),
  content: z
    .string()
    .max(5000, { message: "Content cannot exceed 5000 characters." }),
  photoURL: z.string().url().optional().or(z.literal("")).or(z.null()),
});
