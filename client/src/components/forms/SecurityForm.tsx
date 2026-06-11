import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { securitySchema } from "@/schemas/profile.schema";
import type z from "zod";
import TransitionLink from "../TransitionLink";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";

type FormValues = z.infer<typeof securitySchema>;

export function SecurityForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {};

  return (
    <form className="flex-1" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Security</h3>
          <p className="text-sm text-muted-foreground">
            Leave these blank if you don't want to change your password.
          </p>
        </div>

        <FieldGroup className="space-y-5">
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

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>New Password</FieldLabel>
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
                <FieldLabel>Confirm New Password</FieldLabel>
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
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </form>
  );
}
