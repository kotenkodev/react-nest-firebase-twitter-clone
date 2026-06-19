import z from "zod";

export const MAX_TITLE_LENGTH = 150;
export const MAX_CONTENT_LENGTH = 5000;

export const postSchema = z
  .object({
    title: z
      .string()
      .max(MAX_TITLE_LENGTH, { message: `Title cannot exceed ${MAX_TITLE_LENGTH} characters.` })
      .optional()
      .or(z.literal("")),

    content: z
      .string()
      .max(MAX_CONTENT_LENGTH, { message: `Content cannot exceed ${MAX_CONTENT_LENGTH} characters.` })
      .optional()
      .or(z.literal("")),

    photoURL: z.string().url().optional().or(z.literal("")).or(z.null()),

    hasPendingImage: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const hasImage = !!data.photoURL || data.hasPendingImage;
      const hasTitle = !!data.title?.trim();
      const hasContent = !!data.content?.trim();

      return hasImage || (hasTitle && hasContent);
    },
    {
      message: "Post must have an image OR both title and content",
      path: ["title"],
    },
  );
