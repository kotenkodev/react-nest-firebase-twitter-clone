import apiClient from "@/api/apiClient";
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
      <title>My Feed</title>
      Home
    </div>
  );
}
