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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  forgetPasswordSchema,
  sendResetEmailSchema,
} from "@/schemas/password.schema";
import {
  completePasswordReset,
  sendNewPasswordResetEmail,
} from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type z from "zod";
import { ChevronLeft, Mail, Lock, CheckCircle2 } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

type ResetFormValues = z.infer<typeof forgetPasswordSchema>;
type SendEmailValues = z.infer<typeof sendResetEmailSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const navigate = useNavigate();

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const emailForm = useForm<SendEmailValues>({
    resolver: zodResolver(sendResetEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onResetSubmit = async (data: ResetFormValues) => {
    try {
      setIsLoading(true);
      await completePasswordReset(oobCode!, data.newPassword);
      toast.success(
        "New password set successfully! Please log in with your new password.",
      );
      navigate("/signin");
    } catch (error: any) {
      console.error("Password reset error:", error);
      const message =
        error.code === "auth/invalid-action-code"
          ? "The password reset link is invalid or has expired. Please request a new one."
          : "Failed to reset password. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSendEmailSubmit = async (data: SendEmailValues) => {
    try {
      setIsLoading(true);
      await sendNewPasswordResetEmail(data.email);
      setIsEmailSent(true);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      console.error("Send reset email error:", error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="min-h-[80vh] flex items-center justify-center py-12">
      <title>Forgot Password / Birb</title>

      <Card className="w-full max-w-md shadow-lg border-muted/40">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              {oobCode ? (
                <Lock className="w-6 h-6 text-primary" />
              ) : isEmailSent ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Mail className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {oobCode
              ? "Reset Password"
              : isEmailSent
                ? "Check your email"
                : "Forgot Password"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {oobCode
              ? "Create a new secure password for your account."
              : isEmailSent
                ? "We've sent a password reset link to your inbox."
                : "Enter your email address and we'll send you a reset link."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {oobCode ? (
            <form
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              className="space-y-4"
            >
              <FieldGroup className="space-y-4">
                <Controller
                  name="newPassword"
                  control={resetForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>New Password</FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
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
                  control={resetForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Confirm New Password</FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          ) : isEmailSent ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsEmailSent(false)}
              >
                Try another email
              </Button>
            </div>
          ) : (
            <form
              onSubmit={emailForm.handleSubmit(onSendEmailSubmit)}
              className="space-y-4"
            >
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email Address</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t bg-muted/50 py-4">
          <TransitionLink
            to="/signin"
            className="flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </TransitionLink>
        </CardFooter>
      </Card>
    </Container>
  );
}
