import { useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { auth } from "@/config/firebaseConfig";
import { signInWithPhoneNumber } from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import {
  checkPhoneNumberExists,
  signInWithPhone,
} from "@/services/authService";
import TransitionLink from "../TransitionLink";

export default function PhoneSignIn() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"REQUEST" | "VERIFY">("REQUEST");
  const [isLoading, setIsLoading] = useState(false);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return toast.error("Please enter your phone number");
    setIsLoading(true);
    try {
      const isRegistered = await checkPhoneNumberExists(phoneNumber);
      if (!isRegistered) {
        toast.error(
          "This phone number is not registered. Please sign up first.",
        );
        setIsLoading(false);
        return;
      }

      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        verifier,
      );

      setConfirmationResult(confirmation);
      setStep("VERIFY");
      toast.success("Verification code sent!");
    } catch (error: any) {
      const message =
        error.code === "auth/invalid-verification-code" ||
        error.code === "auth/invalid-credential"
          ? "Invalid phone number or code."
          : "Failed to send code. Ensure correct format: +1234567890";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    if (!otpCode) return toast.error("Please enter the verification code");

    setIsLoading(true);
    try {
      const syncedUser = await signInWithPhone(confirmationResult, otpCode);
      setUser(syncedUser);

      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Sign In
        </CardTitle>
        <CardDescription>Enter your phone number to sign in</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        {step === "REQUEST" ? (
          <form onSubmit={handleSendVerificationCode} className="space-y-4">
            <Field>
              <FieldLabel>Phone Number</FieldLabel>
              <Input
                type="tel"
                placeholder="+1 650 555 3434"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtpCode} className="space-y-4">
            <Field>
              <FieldLabel>Enter 6-Digit OTP</FieldLabel>
              <Input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setStep("REQUEST")}
              className="w-full text-xs"
            >
              Change Phone Number
            </Button>
          </form>
        )}
        <div id="recaptcha-container"></div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
        <span>Don't have an account?</span>
        <TransitionLink
          to="/signup"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Sign Up
        </TransitionLink>
      </CardFooter>
    </Card>
  );
}
