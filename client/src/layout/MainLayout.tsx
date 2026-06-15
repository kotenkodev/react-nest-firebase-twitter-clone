import Header from "@/components/Header";
import { VerifyNotification } from "@/components/VerifyNotification";
import { useAuthStore } from "@/store/useAuthStore";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {!user?.emailVerified && <VerifyNotification />}

      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
