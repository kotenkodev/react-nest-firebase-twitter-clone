import apiClient from "@/services/apiClient";
import TransitionLink from "@/components/TransitionLink";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/");
        const data = await response.data;
        console.log("API Response:", data);
      } catch (error) {
        console.error("Error fetching API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <title>Feed / Birb</title>
      Home
      <button>
        <TransitionLink
          to="/profile"
          label="Go to Profile"
          className="text-blue-500"
        />
      </button>
    </div>
  );
}
