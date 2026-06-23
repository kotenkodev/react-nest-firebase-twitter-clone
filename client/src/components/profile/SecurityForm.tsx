import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { securitySchema } from "@/schemas/profile.schema";
import type z from "zod";
import TransitionLink from "../TransitionLink";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import {
  createUserPassword,
  signOut,
  updateUserPassword,
  verifyPhoneForUpdate,
  linkOrUpdatePhone,
} from "@/services/authService";
import { toast } from "sonner";
import { auth } from "@/config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier } from "firebase/auth";
import { Separator } from "@/components/ui/separator";

type FormValues = z.infer<typeof securitySchema>;

export function SecurityForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPasswordProvider, setHasPasswordProvider] = useState(false);
  const navigate = useNavigate();

  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<"INPUT" | "OTP">("INPUT");
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  useEffect(() => {
    const checkPasswordProvider = () => {
      const user = auth.currentUser;
      if (user) {
        setHasPasswordProvider(
          user.providerData.some((p) => p.providerId === "password"),
        );
        setCurrentPhone(user.phoneNumber);
      }
    };
    checkPasswordProvider();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (hasPasswordProvider && !data.currentPassword) {
      form.setError("currentPassword", {
        type: "manual",
        message: "Current password is required to update your password.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (hasPasswordProvider) {
        await updateUserPassword(data.currentPassword!, data.newPassword);
      } else {
        await createUserPassword(data.newPassword);
        setHasPasswordProvider(true);
      }
      toast.success(
        hasPasswordProvider
          ? "Password updated successfully! Sign in again with your new password."
          : "Password created successfully! You can now sign in with your email and password.",
      );
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      const message =
        error.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : error.code === "auth/requires-recent-login"
            ? "For security reasons, please sign out and sign in again to change your password."
            : "Failed to update password. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
      await signOut();
      navigate("/signin");
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone) return toast.error("Please enter a phone number");
    setIsPhoneLoading(true);
    try {
      const verifier = new RecaptchaVerifier(
        auth,
        "security-recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
        },
      );

      const vId = await verifyPhoneForUpdate(newPhone, verifier);
      setVerificationId(vId);
      setPhoneStep("OTP");
      toast.success("Verification code sent!");
    } catch (error: any) {
      console.error(error);
      const message =
        error.code === "auth/invalid-phone-number"
          ? "Invalid phone number format."
          : error.code === "auth/too-many-requests-for-sign-in"
            ? "Too many requests. Please try again later."
            : error.message ||
              "Failed to send verification code. Ensure correct format (e.g. +1234567890).";
      toast.error(message);
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationId) return;
    if (!phoneOtp) return toast.error("Please enter the verification code");

    setIsPhoneLoading(true);
    try {
      const updatedUser = await linkOrUpdatePhone(verificationId, phoneOtp);
      setCurrentPhone(updatedUser?.phoneNumber || null);
      setIsEditingPhone(false);
      setNewPhone("");
      setPhoneOtp("");
      setPhoneStep("INPUT");
      toast.success("Phone number updated successfully!");
    } catch (error: any) {
      console.error(error);
      const message =
        error.code === "auth/invalid-verification-id"
          ? "Invalid verification code."
          : error.code === "auth/account-exists-with-different-credential"
            ? "Account with this phone number already exists. Try another number."
            : error.code === "auth/invalid-verification-code"
              ? "Invalid verification code. Try again."
              : "Failed to update phone number. Please try again.";
      toast.error(message);
    } finally {
      setIsPhoneLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 sm:pb-3">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Security</h3>
          <p className="text-sm text-muted-foreground">
            {hasPasswordProvider
              ? "Update your password to keep your account secure."
              : "You are currently signed in with Google. Set a password to enable email sign-in as well."}
          </p>
        </div>

        <FieldGroup className="space-y-5">
          {hasPasswordProvider && (
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Current Password</FieldLabel>
                    <TransitionLink
                      to="/forgot-password"
                      className="text-xs text-primary hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </TransitionLink>
                  </div>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {hasPasswordProvider ? "New Password" : "Password"}
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmNewPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {hasPasswordProvider
                    ? "Confirm New Password"
                    : "Confirm Password"}
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : hasPasswordProvider
                ? "Update Password"
                : "Set Password"}
          </Button>
        </div>
      </form>

      <Separator className="my-6" />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Phone Number</h3>
          <p className="text-sm text-muted-foreground">
            Add or update a verified phone number for your account.
          </p>
        </div>

        {isEditingPhone ? (
          <div className="space-y-4 max-w-md">
            {phoneStep === "INPUT" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <Field>
                  <FieldLabel>New Phone Number</FieldLabel>
                  <Input
                    type="tel"
                    placeholder="+1 650 555 3434"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    disabled={isPhoneLoading}
                  />
                </Field>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditingPhone(false);
                      setNewPhone("");
                    }}
                    disabled={isPhoneLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPhoneLoading}>
                    {isPhoneLoading ? "Sending..." : "Send Code"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <Field>
                  <FieldLabel>Verification Code</FieldLabel>
                  <Input
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    disabled={isPhoneLoading}
                  />
                </Field>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPhoneStep("INPUT");
                      setPhoneOtp("");
                    }}
                    disabled={isPhoneLoading}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isPhoneLoading}>
                    {isPhoneLoading ? "Verifying..." : "Verify & Update"}
                  </Button>
                </div>
              </form>
            )}
            <div id="security-recaptcha-container"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border rounded-xl bg-card max-w-md">
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Verified Phone
              </span>
              <p className="text-sm font-medium">
                {currentPhone || "No phone number added"}
              </p>
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditingPhone(true)}
            >
              {currentPhone ? "Change" : "Add Phone"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
