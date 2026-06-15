import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  CogIcon,
  SquareArrowRightExit,
  StickyNotePlusIcon,
  UserIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import TransitionLink from "./TransitionLink";
import { getInitials } from "@/utils/getInitials";
import { signOut } from "@/services/authService";
import { useUIStore } from "@/store/useUIStore";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { setPostDialogOpen } = useUIStore();
  const { user, setUser, setLoading, setError } = useAuthStore();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-10 w-10 cursor-pointer border shadow-sm transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background">
            <AvatarImage src={user?.photoURL} alt={user?.email} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
              {getInitials(`${user?.firstName} ${user?.lastName}`)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-64 p-2 rounded-xl shadow-lg border-muted/60"
        >
          <DropdownMenuLabel className="flex flex-col space-y-1.5 p-3">
            <p className="text-sm font-semibold tracking-tight text-foreground leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground leading-none truncate">
              {user?.email || "No email provided"}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem asChild className="p-0">
            <TransitionLink
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 cursor-pointer rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <UserIcon className="h-4 w-4 opacity-70" />
              <span>Profile</span>
            </TransitionLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="p-0 mt-1">
            <TransitionLink
              to="/profile/settings"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 cursor-pointer rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <CogIcon className="h-4 w-4 opacity-70" />
              <span>Settings</span>
            </TransitionLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-0 mt-1">
            <button
              type="button"
              className="flex w-full items-center gap-3 cursor-pointer rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setPostDialogOpen(true);
                setIsOpen(false);
              }}
            >
              <StickyNotePlusIcon className="h-4 w-4 opacity-70" />
              <span>Create Post</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={() => {
              handleSignOut();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 cursor-pointer rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors focus:bg-destructive/10 focus:text-destructive"
          >
            <SquareArrowRightExit className="h-4 w-4 opacity-90" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
