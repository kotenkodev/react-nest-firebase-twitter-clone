import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type AccountModalProps = {
  onDeleteAccount: () => void;
};

export function AccountModal({ onDeleteAccount }: AccountModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="default">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDeleteAccount}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
