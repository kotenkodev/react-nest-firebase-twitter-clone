import { postSchema } from "@/schemas/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { createPost } from "@/services/postsService";
import { uploadPostImage } from "@/services/storageService";
import { collection, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { ImagePlus, Loader2, X } from "lucide-react";

type FormValues = z.infer<typeof postSchema>;

type PostFormProps = {
  onSuccess?: () => void;
};

export default function PostForm({ onSuccess }: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      photoURL: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // 1. Generate a new Post ID on the client side
      const newPostRef = doc(collection(db, "posts"));
      const postId = newPostRef.id;

      let photoURL = data.photoURL;

      // 2. If a file is selected, upload it to /posts/{postId}
      if (selectedFile) {
        photoURL = await uploadPostImage(postId, selectedFile);
      }

      // 3. Create the post record via the backend API
      await createPost({
        ...data,
        id: postId,
        photoURL: photoURL || undefined,
      });

      toast.success("Post created successfully!");
      form.reset();
      removeImage();
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="space-y-4">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Title</FieldLabel>
              <Input
                {...field}
                type="text"
                placeholder="What's the title?"
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Content</FieldLabel>
              <Textarea
                {...field}
                placeholder="Tell your story..."
                disabled={isLoading}
                className="resize-none min-h-[120px]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="space-y-2">
          <FieldLabel>Post Image</FieldLabel>
          {previewUrl ? (
            <div className="relative group rounded-lg overflow-hidden border bg-muted aspect-video">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25"
            >
              <ImagePlus className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload image</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            disabled={isLoading}
          />
        </div>
      </FieldGroup>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          className="w-full sm:w-auto font-semibold px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  );
}
