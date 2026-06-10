import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
