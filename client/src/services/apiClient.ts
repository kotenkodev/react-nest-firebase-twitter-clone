import { auth } from "@/config/firebaseConfig";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Token refresh failed, signing out:", error);
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          toast.error("Session expired. Please sign in again.");
          try {
            await auth.signOut();
          } catch (e) {
            console.error(
              "Error during auto-sign-out on token refresh failure:",
              e,
            );
          } finally {
            useAuthStore.getState().setUser(null);
          }
        }
        return Promise.reject(error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        toast.error("Session expired. Please sign in again.");
        try {
          await auth.signOut();
        } catch (e) {
          console.error("Error during auto-sign-out on 401 error:", e);
        } finally {
          useAuthStore.getState().setUser(null);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
