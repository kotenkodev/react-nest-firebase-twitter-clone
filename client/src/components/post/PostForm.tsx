import { postSchema, MAX_CONTENT_LENGTH } from "@/schemas/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { uploadPostImage } from "@/services/storageService";
import { collection, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Loader2Icon } from "lucide-react";
import type { Post } from "@/types/post.types";
import ImageUploader from "../profile/ImageUploader";
import { CountedTextarea } from "../CountedTextarea";
import { useCreatePost } from "@/hooks/posts/useCreatePost";
import { useUpdatePost } from "@/hooks/posts/useUpdatePost";

type FormValues = z.infer<typeof postSchema>;

type PostFormProps = {
  onSuccess?: () => void;
  post?: Post | null;
};


export default function PostForm({ onSuccess, post }: PostFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const { createPost, isCreating } = useCreatePost();
  const { updatePost, isUpdating } = useUpdatePost();
  const isLoading = isCreating || isUpdating;

  const isEditMode = Boolean(post);

  const form = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      photoURL: post?.photoURL || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const postId =
        isEditMode && post ? post.id : doc(collection(db, "posts")).id;

      let photoURL = data.photoURL;

      if (selectedFile) {
        photoURL = await uploadPostImage(postId, selectedFile);
      } else if (isImageRemoved) {
        photoURL = "";
      }

      if (isEditMode && post) {
        updatePost({ postId: post.id, data: { ...data, photoURL } });
      } else {
        createPost({
          ...data,
          id: postId,
          photoURL: photoURL,
        });
      }

      toast.success(`Post ${isEditMode ? "updated" : "created"} successfully!`);
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to save post:", error);
      toast.error(
        `Failed to ${isEditMode ? "update" : "create"} post. Please try again.`,
      );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        <div className="w-full">
          <ImageUploader
            defaultImage={post?.photoURL}
            fallbackText={"-"}
            title="Post Photo (Optional)"
            variant="rectangle"
            description="Click the image to upload a new photo for your post."
            onFileSelect={(file) => {
              setSelectedFile(file);
              setIsImageRemoved(false);
              form.setValue("hasPendingImage", !!file, {
                shouldValidate: true,
              });
            }}
            onRemove={() => {
              setSelectedFile(null);
              setIsImageRemoved(true);

              form.setValue("hasPendingImage", false, { shouldValidate: true });
              form.setValue("photoURL", "", { shouldValidate: true });
            }}
          />
        </div>

        <div className="flex flex-col h-full gap-5 py-4">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base font-semibold">
                  Title
                </FieldLabel>
                <Input
                  {...field}
                  type="text"
                  placeholder="What's the title?"
                  disabled={isLoading}
                  className="text-lg py-6"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex-1 flex flex-col"
              >
                <FieldLabel className="text-base font-semibold">
                  Content
                </FieldLabel>

                <CountedTextarea
                  {...field}
                  maxLength={MAX_CONTENT_LENGTH}
                  placeholder="Tell your story..."
                  disabled={isLoading}
                  className="flex-1 min-h-75 max-h-75 overflow-y-auto resize-none text-base leading-relaxed pb-8"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto font-semibold px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : isEditMode ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  );
}
