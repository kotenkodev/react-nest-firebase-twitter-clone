import { BirdIcon } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useAuthStore } from "@/store/useAuthStore";
import TransitionLink from "./TransitionLink";
import { MobileMenu } from "./MobileMenu";

export default function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 flex items-center z-10 bg-white justify-between p-4 border-b dark:border-gray-700">
      <div className="flex items-center gap-6 md:gap-8">
        <TransitionLink
          to="/"
          className="flex items-center space-x-2 font-bold"
        >
          <BirdIcon />
          <span className="inline-block">Birb</span>
        </TransitionLink>
      </div>
      <div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden sm:block text-sm text-muted-foreground">
            Welcome, {user?.firstName} {user?.lastName}
          </div>
          <div className="w-full flex-1 md:w-auto md:flex-none max-w-sm hidden sm:block">
            <ProfileDropdown />
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
