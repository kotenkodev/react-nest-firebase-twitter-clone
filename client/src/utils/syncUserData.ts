import { db } from "@/config/firebaseConfig";
import type { User, UpdateUser } from "@/types/user.types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { transformUserPayload } from "./transformPayload";

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

type FirestoreUser = Omit<User, "id">;

export const syncUserData = async (
  user: AuthUser,
  additionalData?: UpdateUser,
): Promise<User> => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      const [firstName = "", ...lastNameParts] = (user.displayName || "").split(
        " ",
      );
      const lastName = lastNameParts.join(" ");

      const dbData: FirestoreUser = {
        firstName,
        lastName,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        createdAt: new Date(),
        ...additionalData,
      };

      await setDoc(userDocRef, dbData);

      return transformUserPayload({ id: user.uid, ...dbData });
    }

    const existingData = userSnapshot.data() as FirestoreUser;

    if (additionalData && Object.keys(additionalData).length > 0) {
      await setDoc(userDocRef, additionalData, { merge: true });

      const mergedData = { ...existingData, ...additionalData };

      return transformUserPayload({ id: user.uid, ...mergedData });
    }

    return transformUserPayload({ id: userSnapshot.id, ...existingData });
  } catch (error) {
    console.error("Error syncing user data:", error);
    throw error;
  }
};
