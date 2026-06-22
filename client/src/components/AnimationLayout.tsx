import { animatePageIn } from "@/utils/animations";
import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import LoadingAnimation from "./LoadingBar";

export default function AnimationLayout() {
  const location = useLocation();

  useEffect(() => {
    animatePageIn();
  }, [location.pathname]);

  return (
    <div>
      <LoadingAnimation />
      <div
        id="banner-1"
        className="min-h-screen bg-neutral-950 z-50 fixed top-0 left-0 w-1/4 pointer-events-none"
      />
      <div
        id="banner-2"
        className="min-h-screen bg-neutral-950 z-50 fixed top-0 left-1/4 w-1/4 pointer-events-none"
      />
      <div
        id="banner-3"
        className="min-h-screen bg-neutral-950 z-50 fixed top-0 left-2/4 w-1/4 pointer-events-none"
      />
      <div
        id="banner-4"
        className="min-h-screen bg-neutral-950 z-50 fixed top-0 left-3/4 w-1/4 pointer-events-none"
      />

      <Outlet />
    </div>
  );
}
