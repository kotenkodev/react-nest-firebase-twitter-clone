import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/utils/getInitials";
import { Camera, Loader2, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { updateUser } from "@/services/usersService";
import { uploadAvatar } from "@/services/storageService";
import { useRef, useState } from "react";
import type { User } from "@/types/user";

type AvatarUploadProps = {
  user: User;
  setUser: (user: User) => void;
};

export default function AvatarUpload({ user, setUser }: AvatarUploadProps) {
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      const downloadURL = await uploadAvatar(user.id, selectedFile);
      const updatedUser = await updateUser(user.id, { photoURL: downloadURL });

      setUser(updatedUser);

      toast.success("Profile picture updated!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
      <div
        className="relative inline-block cursor-pointer group shrink-0"
        onClick={handleAvatarClick}
      >
        <Avatar className="h-24 w-24 border-4 border-background shadow-sm group-hover:border-primary/50 transition-colors">
          <AvatarImage
            src={avatarPreview || user.photoURL}
            alt="User avatar"
            className="object-cover"
          />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {getInitials(`${user.firstName} ${user.lastName}`)}
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-8 w-8 text-white" />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
      </div>

      <div className="space-y-2 text-center sm:text-left flex-1">
        <h3 className="font-medium">Profile Picture</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Click the avatar to upload a new image. Recommended size is 256x256px.
        </p>
        {selectedFile && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="mt-2"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload selected file
          </Button>
        )}
      </div>
    </div>
  );
}
