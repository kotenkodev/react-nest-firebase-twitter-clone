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

      const cleanDbData = Object.fromEntries(
        Object.entries(dbData).filter(([_, v]) => v !== undefined),
      ) as FirestoreUser;

      await setDoc(userDocRef, cleanDbData);

      return transformUserPayload({ id: user.uid, ...cleanDbData });
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

      const cleanUpdatePayload = Object.fromEntries(
        Object.entries(updatePayload).filter(([_, v]) => v !== undefined),
      );

      await setDoc(userDocRef, cleanUpdatePayload, { merge: true });

      const mergedData = { ...existingData, ...cleanUpdatePayload };

      return transformUserPayload({ id: user.uid, ...mergedData });
    }

    return transformUserPayload({ id: userSnapshot.id, ...existingData });
  } catch (error) {
    console.error("Error syncing user data:", error);
    throw error;
  }
};
