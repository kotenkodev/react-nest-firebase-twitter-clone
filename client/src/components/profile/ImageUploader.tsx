import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, ImageIcon, Loader2Icon, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useRef, useState, useEffect } from "react";

type ImageUploaderProps = {
  defaultImage?: string;
  fallbackText?: string;
  variant?: "avatar" | "rectangle";
  title?: string;
  description?: string;
  onUpload?: (file: File) => Promise<void>;
  onFileSelect?: (file: File | null) => void;
  onRemove?: () => void;
};

export default function ImageUploader({
  defaultImage,
  fallbackText = "?",
  variant = "avatar",
  title,
  description,
  onUpload,
  onFileSelect,
  onRemove,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(defaultImage || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(defaultImage || "");
    setSelectedFile(null);
  }, [defaultImage]);

  const handleContainerClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleClearSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileSelect) onFileSelect(null);
    if (onRemove) onRemove();
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUpload) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      toast.success("Image uploaded successfully!");

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onFileSelect) onFileSelect(null);
      if (onRemove) onRemove();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`flex gap-6 py-4 ${variant === "avatar" ? "flex-col sm:flex-row items-center" : "flex-col"}`}
    >
      <div className="relative group shrink-0">
        <div
          className="cursor-pointer h-full w-full"
          onClick={handleContainerClick}
        >
          {variant === "avatar" ? (
            <Avatar className="h-24 w-24 border-4 border-background shadow-sm group-hover:border-primary/50 transition-colors inline-block relative">
              <AvatarImage
                src={previewUrl}
                alt="Avatar preview"
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {fallbackText}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-full min-h-40 rounded-lg border-2 border-dashed border-muted bg-muted/30 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Post preview"
                  className="max-h-64 w-auto max-w-full object-contain p-1"
                />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground py-8">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-sm">Click to browse images</span>
                </div>
              )}
            </div>
          )}

          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 ${variant === "avatar" ? "rounded-full" : "rounded-lg"}`}
          >
            <Camera className="h-8 w-8 text-white" />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp, image/gif"
        />
      </div>

      <div
        className={`space-y-2 flex-1 ${variant === "avatar" ? "text-center sm:text-left" : "text-left"}`}
      >
        {title && <h3 className="font-medium">{title}</h3>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {selectedFile && (
          <div
            className={`flex items-center gap-2 mt-2 ${variant === "avatar" ? "justify-center sm:justify-start" : ""}`}
          >
            {onUpload && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              variant={onUpload ? "ghost" : "secondary"}
              onClick={handleClearSelection}
              disabled={isUploading}
              className={
                onUpload ? "text-muted-foreground hover:text-foreground" : ""
              }
            >
              {onUpload ? "Cancel" : "Remove Selection"}
            </Button>
          </div>
        )}

        {defaultImage && onRemove && (
          <Button
            type="button"
            size="sm"
            variant={onUpload ? "ghost" : "secondary"}
            onClick={handleClearSelection}
            disabled={isUploading}
            className={
              onUpload ? "text-muted-foreground hover:text-foreground" : ""
            }
          >
            Remove Selection
          </Button>
        )}
      </div>
    </div>
  );
}
