import z from "zod";

export const postSchema = z
  .object({
    title: z
      .string()
      .max(150, { message: "Title cannot exceed 150 characters." })
      .optional()
      .or(z.literal("")),

    content: z
      .string()
      .max(5000, { message: "Content cannot exceed 5000 characters." })
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
