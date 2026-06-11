import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import { getInitials } from "@/utils/getInitials";
import { Camera, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { SecurityForm } from "@/components/forms/SecurityForm";
import { ProfileInfoForm } from "@/components/forms/ProfileInfoForm";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  if (!user) {
    return (
      <Container className="mt-10">
        <p className="text-center text-muted-foreground">User not found.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-8 mb-12 max-w-6xl mx-auto">
      <title>Profile Settings / Birb</title>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription>
            Manage your public profile details and account security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
            <div
              className="relative inline-block cursor-pointer group shrink-0"
              onClick={handleAvatarClick}
            >
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm group-hover:border-primary/50 transition-colors">
                <AvatarImage
                  src={avatarPreview}
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
                Click the avatar to upload a new image. Recommended size is
                256x256px.
              </p>
              {selectedFile && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload selected file
                </Button>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pt-2">
            <ProfileInfoForm user={user} />

            <Separator
              orientation="vertical"
              className="hidden lg:block h-auto"
            />
            <Separator orientation="horizontal" className="block lg:hidden" />

            <SecurityForm />
          </div>

          <Separator />
        </CardContent>
        <CardFooter>
          <div>Danger Zone</div>

          <Button variant="destructive">Delete Account</Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
