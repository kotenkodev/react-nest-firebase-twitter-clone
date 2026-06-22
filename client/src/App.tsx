import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DefaultLayout from "./layout/DefaultLayout";
import MainLayout from "./layout/MainLayout";
import NotFound from "./pages/NotFound";
import Post from "./pages/Post";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { auth } from "./config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import BirdLoadingBar from "./components/LoadingBar";
import AnimationLayout from "./components/AnimationLayout";
import { getUser } from "./services/usersService";
import ProfileSettings from "./pages/ProfileSettings";
import ProfileView from "./pages/ProfileView";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";

function AppContent() {
  const location = useLocation();
  const background = location.state && location.state.background;

  const setUser = useAuthStore((state) => state.setUser);
  const { setLoading, isLoading } = useAuthStore((state) => state);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const currentStoreUser = useAuthStore.getState().user;
          if (
            currentStoreUser?.id === firebaseUser.uid &&
            currentStoreUser.firstName
          ) {
            setLoading(false);
            return;
          }

          try {
            const response = await getUser();
            setUser(response);
          } catch (e) {
            console.error("Error fetching user data from backend:", e);

            const [firstName = "", ...lastNameParts] = (
              firebaseUser.displayName || ""
            ).split(" ");
            const lastName = lastNameParts.join(" ");

            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              firstName: firstName || "User",
              lastName: lastName,
              photoURL: firebaseUser.photoURL || "",
              emailVerified: firebaseUser.emailVerified,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (isLoading) {
    return <BirdLoadingBar withBackground />;
  }

  return (
    <>
      <Routes location={background || location}>
        <Route element={<AnimationLayout />}>
          <Route element={<DefaultLayout />}>
            <Route element={<PublicRoute />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<Post />} />

            <Route path="/profile/:id" element={<ProfileView />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile">
                <Route index element={<ProfileView />} />
                <Route path="settings" element={<ProfileSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route path="/post/:id" element={<Post isModal />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
