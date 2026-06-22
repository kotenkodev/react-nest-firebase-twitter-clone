import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import { useState } from "react";
import { signIn } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { signInSchema } from "@/schemas/auth.schema";
import TransitionLink from "../TransitionLink";

type FormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const user = await signIn(data);
      setUser(user);

      toast.success("Successfully signed in! Welcome back!");
      navigate("/");
    } catch (error: any) {
      console.error("Sign-in error:", error.code);
      const message =
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : "Failed to sign in. Please check your credentials.";
      toast.error(message);
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
        <CardDescription>Choose your preferred sign in method</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <GoogleButton onSuccess={() => navigate("/")} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form
          id="signin-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
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
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Password</FieldLabel>
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
                    autoComplete="current-password"
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
            className="w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
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
