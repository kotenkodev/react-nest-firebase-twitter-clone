import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransitionLink from "@/components/TransitionLink";
import { ChevronLeftIcon, MailIcon, AlertTriangleIcon } from "lucide-react";
import { completeEmailVerification } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { syncUserData } from "@/utils/syncUserData";

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const onComplete = async () => {
    try {
      setIsLoading(true);
      await completeEmailVerification(oobCode!);

      if (auth.currentUser) {
        const updatedUser = await syncUserData(auth.currentUser);
        setUser(updatedUser);
      }

      toast.success("Email verified successfully!");
      navigate("/");
    } catch (error) {
      console.error("Email verification error:", error);
      let message = "Failed to verify email. Please try again.";
      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === "auth/expired-action-code") {
          message =
            "This verification link has expired. Please request a new one.";
        } else if (firebaseError.code === "auth/invalid-action-code") {
          message =
            "This verification link is invalid or has already been used.";
        }
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="min-h-[80vh] flex items-center justify-center py-12">
      <title>Verify Email / Birb</title>

      <Card className="w-full max-w-md shadow-lg border-muted/40">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              {oobCode ? (
                <MailIcon className="w-6 h-6 text-primary" />
              ) : (
                <AlertTriangleIcon className="w-6 h-6 text-amber-500" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {oobCode ? "Verify Email Address" : "Invalid Verification Link"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {oobCode
              ? "Confirm your email address to secure your account."
              : "No verification code was found or the link is invalid."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {oobCode ? (
            <Button
              onClick={onComplete}
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify My Email"}
            </Button>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Please check your inbox for the verification email or request a
              new link from your profile settings.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t bg-muted/50 py-4">
          <TransitionLink
            to="/signin"
            className="flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Sign In
          </TransitionLink>
        </CardFooter>
      </Card>
    </Container>
  );
}
