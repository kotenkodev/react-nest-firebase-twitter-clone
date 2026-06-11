import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DefaultLayout from "./layout/DefaultLayout";
import MainLayout from "./layout/MainLayout";
import NotFound from "./pages/NotFound";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { auth } from "./config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import BirdLoadingBar from "./components/BirdLoadingBar";
import AnimationLayout from "./components/AnimationLayout";
import { getUser } from "./services/usersService";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const { setLoading, isLoading } = useAuthStore((state) => state);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          try {
            const response = await getUser();
            const customUserData = response;
            setUser(customUserData);
          } catch (e) {
            console.error("Error fetching user data from backend:", e);
            setUser({
              ...firebaseUser,
              photoURL: firebaseUser.photoURL || "",
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
      <BrowserRouter>
        <Routes>
          <Route element={<AnimationLayout />}>
            <Route element={<PublicRoute />}>
              <Route element={<DefaultLayout />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
