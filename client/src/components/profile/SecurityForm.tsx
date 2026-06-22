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
} from "@/services/authService";
import { toast } from "sonner";
import { auth } from "@/config/firebaseConfig";
import { useNavigate } from "react-router-dom";

type FormValues = z.infer<typeof securitySchema>;

export function SecurityForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPasswordProvider, setHasPasswordProvider] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPasswordProvider = () => {
      const user = auth.currentUser;
      if (user) {
        setHasPasswordProvider(
          user.providerData.some((p) => p.providerId === "password"),
        );
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

  return (
    <form className="flex-1 sm:pb-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
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
      </div>
    </form>
  );
}
