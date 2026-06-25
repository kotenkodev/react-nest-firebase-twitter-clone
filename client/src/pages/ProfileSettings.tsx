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
import { SecurityForm } from "@/components/profile/SecurityForm";
import { ProfileInfoForm } from "@/components/profile/ProfileInfoForm";
import { toast } from "sonner";
import { AccountModal } from "../components/profile/AccountModal";
import ImageUploader from "../components/profile/ImageUploader";
import { getInitials } from "@/utils/getInitials";
import { uploadAvatar } from "@/services/storageService";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "@/services/authService";
import { useUpdateUser } from "@/hooks/users/useUpdateUser";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export default function Profile() {
  useDocumentTitle("Settings / Birb");

  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const { updateUser } = useUpdateUser();

  async function handleDeleteAccount() {
    try {
      await deleteAccount();

      toast.success("Account deleted successfully!");
      navigate("/");
    } catch {
      toast.error("Failed to delete account. Please try again.");
    }
  }

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    try {
      const downloadURL = await uploadAvatar(user.id, file);
      const updated = await updateUser({
        id: user.id,
        data: { photoURL: downloadURL },
      });

      setUser(updated);
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription>
            Manage your public profile details and account security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader
            defaultImage={user.photoURL}
            fallbackText={getInitials(`${user.firstName} ${user.lastName}`)}
            title="Profile Picture"
            variant="avatar"
            description="Click the avatar to upload a new image. Recommended size is 256x256px."
            onUpload={handleUpload}
          />

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

          <Separator className="block mt-3" />
        </CardContent>
        <CardFooter>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div>
              <h3 className="font-medium">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <AccountModal onDeleteAccount={handleDeleteAccount} />
          </div>
        </CardFooter>
      </Card>
    </Container>
  );
}
