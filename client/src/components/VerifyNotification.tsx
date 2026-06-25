import { AlertTriangleIcon } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "./ui/button";
import { sendNewEmailVerification } from "@/services/authService";
import { toast } from "sonner";
import { useState } from "react";

export function VerifyNotification() {
  const [isSent, setIsSent] = useState(false);

  const handleSendVerificationEmail = async () => {
    try {
      setIsSent(true);
      await sendNewEmailVerification();
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      setIsSent(false);
      console.error("Error sending verification email:", error);
      if (error.response?.status === 429) {
        toast.error(
          "Too many requests. Please wait a minute before requesting another verification email.",
        );
      } else {
        toast.error("Failed to send verification email. Please try again later.");
      }
    }
  };

  return (
    <Alert className="w-full rounded-none border-x-0 border-t-0 border-b-amber-200 bg-amber-50 text-amber-900 dark:border-b-amber-900 dark:bg-amber-950 dark:text-amber-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 px-4 sm:px-6">
      <div className="flex items-start sm:items-center gap-3">
        <AlertTriangleIcon className="h-5 w-5 shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <AlertTitle className="mb-1">
            Your account needs verification
          </AlertTitle>
          <AlertDescription>
            Please verify your account to prove that you are real user and get
            verified badge. Check your email for the verification link.
          </AlertDescription>
        </div>
      </div>

      <AlertAction className="w-fit shrink-0 pl-8 sm:pl-0 self-start sm:self-auto">
        <Button
          onClick={handleSendVerificationEmail}
          size="sm"
          variant="outline"
          disabled={isSent}
          className="bg-transparent border-amber-300 hover:bg-amber-100 text-amber-900 dark:border-amber-700 dark:hover:bg-amber-900 dark:text-amber-50"
        >
          {isSent ? "Email Sent" : "Send Email"}
        </Button>
      </AlertAction>
    </Alert>
  );
}
