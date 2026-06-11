import { Link } from "react-router-dom";
import { Bird, Menu } from "lucide-react";
import { Button } from "./ui/button";
import ProfileDropdown from "./ProfileDropdown";
import { useAuthStore } from "@/store/useAuthStore";
import TransitionLink from "./TransitionLink";

export default function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <div className="flex items-center gap-6 md:gap-8">
        <TransitionLink
          to="/"
          className="flex items-center space-x-2 font-bold"
        >
          <Bird />
          <span className="inline-block">Birb</span>
        </TransitionLink>
      </div>
      <div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div>
            Welcome, {user?.firstName} {user?.lastName}
          </div>
          <div className="w-full flex-1 md:w-auto md:flex-none max-w-sm hidden sm:block">
            <ProfileDropdown />
          </div>

          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
