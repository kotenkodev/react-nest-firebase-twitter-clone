import { db } from "@/config/firebaseConfig";
import type { User, UpdateUser } from "@/types/user.types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { transformUserPayload } from "./transformPayload";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
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
        email: user.email || "",
        emailVerified: user.emailVerified,
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        ...additionalData,
      };

      await setDoc(userDocRef, dbData);

      return transformUserPayload({ id: user.uid, ...dbData });
    }

    const existingData = userSnapshot.data() as FirestoreUser;

    const needsSync = existingData.emailVerified !== user.emailVerified;

    if (needsSync || (additionalData && Object.keys(additionalData).length > 0)) {
      const syncFields: Partial<FirestoreUser> = {};
      if (existingData.emailVerified !== user.emailVerified) {
        syncFields.emailVerified = user.emailVerified;
      }

      const updatePayload = {
        ...syncFields,
        ...additionalData,
      };

      await setDoc(userDocRef, updatePayload, { merge: true });

      const mergedData = { ...existingData, ...updatePayload };

      return transformUserPayload({ id: user.uid, ...mergedData });
    }

    return transformUserPayload({ id: userSnapshot.id, ...existingData });
  } catch (error) {
    console.error("Error syncing user data:", error);
    throw error;
  }
};
