import z from "zod";

export const MAX_COMMENT_LENGTH = 300;

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty.")
    .max(MAX_COMMENT_LENGTH, "Comment must be less than 300 characters."),
});
