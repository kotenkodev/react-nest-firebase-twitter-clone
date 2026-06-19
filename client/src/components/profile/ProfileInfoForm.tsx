import { profileInfoSchema, MAX_BIO_LENGTH } from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { DatePicker } from "../ui/date-picker";
import { useState } from "react";
import type { User } from "@/types/user.types";
import { Input } from "../ui/input";
import type z from "zod";
import { updateUser } from "@/services/usersService";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { CountedTextarea } from "../CountedTextarea";

type FormValues = z.infer<typeof profileInfoSchema>;

export function ProfileInfoForm({ user }: { user: User }) {
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      birthDate: user?.birthDate || undefined,
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const updatedData: User = await updateUser(user.id, data);

      setUser(updatedData);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex-1 sm:pb-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Public Information
          </h3>
          <p className="text-sm text-muted-foreground">
            This will be displayed on your profile.
          </p>
        </div>

        <FieldGroup className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>First Name</FieldLabel>
                  <Input {...field} placeholder="John" disabled={isLoading} />
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
                  <Input {...field} placeholder="Doe" disabled={isLoading} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Bio</FieldLabel>
                <CountedTextarea
                  {...field}
                  maxLength={MAX_BIO_LENGTH}
                  placeholder="Tell your story..."
                  disabled={isLoading}
                  className="flex-1 min-h-40 max-h-40 resize-none text-base leading-relaxed pb-8"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="birthDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Date of Birth</FieldLabel>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={fieldState.invalid || isLoading}
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
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </form>
  );
}
