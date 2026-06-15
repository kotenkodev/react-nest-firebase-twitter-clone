import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  CogIcon,
  MenuIcon,
  SquareArrowRightExit,
  UserIcon,
} from "lucide-react";
import TransitionLink from "./TransitionLink";
import { signOut } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { setUser, setLoading, setError } = useAuthStore();

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

  const navItemStyles =
    "flex items-center gap-4 rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:bg-accent/80 select-none";

  const logoutItemStyles =
    "flex items-center gap-4 rounded-md px-4 py-3 text-base font-medium text-destructive transition-colors hover:bg-destructive/10 active:bg-destructive/20 mt-2 select-none cursor-pointer";

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="sm:hidden" variant="outline" size="icon">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left pt-6 pb-2">
          <DrawerTitle className="text-xl font-bold tracking-tight">
            Menu
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Open the navigation menu
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-1 overflow-y-auto">
          <TransitionLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={navItemStyles}
          >
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
          </TransitionLink>

          <TransitionLink
            to="/profile/settings"
            onClick={() => setIsOpen(false)}
            className={navItemStyles}
          >
            <CogIcon className="h-5 w-5" />
            <span>Settings</span>
          </TransitionLink>

          <div className="pt-4 mt-4 border-t">
            <div
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
              className={logoutItemStyles}
            >
              <SquareArrowRightExit className="h-5 w-5" />
              <span>Logout</span>
            </div>
          </div>
        </div>

        <DrawerFooter className="pt-4 pb-8 px-4">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold"
            >
              Close Menu
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
