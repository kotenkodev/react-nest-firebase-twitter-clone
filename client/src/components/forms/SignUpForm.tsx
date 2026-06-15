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
import { signUp } from "@/services/authService";
import { signUpSchema } from "@/schemas/auth.schema";
import { useAuthStore } from "@/store/useAuthStore";
import TransitionLink from "../TransitionLink";

type FormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const user = await signUp(data);
      setUser(user);

      toast.success("Successfully signed up! Welcome aboard!");
      navigate("/");
    } catch (error: any) {
      console.error("Sign-up error:", error.code);
      const message =
        error.code === "auth/email-already-in-use"
          ? "An account with this email already exists. Please sign in instead."
          : error.code === "auth/invalid-credential"
            ? "Invalid email or password."
            : "Failed to sign up. Please check your credentials.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Sign Up
        </CardTitle>
        <CardDescription>Choose your preferred sign up method</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
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
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>First Name</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      autoComplete="given-name"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Last Name</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      autoComplete="family-name"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
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
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Confirm Password</FieldLabel>
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
            </div>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full font-semibold mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground pt-0">
        <span>Already have an account?</span>
        <TransitionLink
          to="/signin"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Sign In
        </TransitionLink>
      </CardFooter>
    </Card>
  );
}
