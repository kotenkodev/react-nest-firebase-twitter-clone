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
import { SecurityForm } from "@/components/forms/SecurityForm";
import { ProfileInfoForm } from "@/components/forms/ProfileInfoForm";
import { toast } from "sonner";
import { AccountModal } from "./AccountModal";
import AvatarUpload from "./AvatarUpload";

export default function Profile() {
  const { user, setUser } = useAuthStore();

  if (!user) {
    return (
      <Container className="mt-10">
        <p className="text-center text-muted-foreground">User not found.</p>
      </Container>
    );
  }

  async function handleDeleteAccount() {
    try {
      // const response = await deleteUser(user.id);
      // await deleteAccount();

      toast.success("Account deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
    } finally {
    }
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
          <AvatarUpload user={user} setUser={setUser} />

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
