import { auth, storage } from "@/config/firebaseConfig";
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

export const uploadPostImage = async (
  postId: string,
  file: File,
): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const storageRef = ref(storage, `posts/${postId}`);

    const metadata = {
      customMetadata: {
        authorId: user.uid,
      },
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading post image:", error);
    throw error;
  }
};
