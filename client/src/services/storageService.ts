import { storage } from "@/config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadAvatar = async (
  userId: string,
  file: File,
): Promise<string> => {
  try {
    const storageRef = ref(storage, `avatars/${userId}`);

    const snapshot = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};
