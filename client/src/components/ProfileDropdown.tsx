import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CogIcon, SquareArrowRightExit, UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { auth } from "@/config/firebaseConfig";
import TransitionLink from "./TransitionLink";
import { getInitials } from "@/utils/getInitials";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, setLoading, setError } = useAuthStore();

  const handleSignOut = () => {
    try {
      setLoading(true);
      auth.signOut();
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
          <Avatar className="w-8 h-8 hover:ring-2 hover:ring-primary hover:ring-offset-2">
            <AvatarImage src={user?.photoURL} alt={user?.email} />
            <AvatarFallback>
              {getInitials(`${user?.firstName} ${user?.lastName}`)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={5}
          className="w-auto min-w-0"
        >
          <DropdownMenuItem asChild>
            <div onClick={() => setIsOpen(false)}>
              <TransitionLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full cursor-pointer flex items-center justify-between gap-2"
              >
                Profile
                <UserIcon className="mr-2 h-4 w-4" />
              </TransitionLink>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <div onClick={() => setIsOpen(false)}>
              <TransitionLink
                to="/profile/settings"
                onClick={() => setIsOpen(false)}
                className="w-full cursor-pointer flex items-center justify-between gap-2"
              >
                Settings
                <CogIcon className="mr-2 h-4 w-4" />
              </TransitionLink>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <div className="w-full cursor-pointer flex items-center justify-between gap-2">
              <span
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full cursor-pointer"
              >
                Logout
              </span>
              <SquareArrowRightExit className="mr-2 h-4 w-4" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
