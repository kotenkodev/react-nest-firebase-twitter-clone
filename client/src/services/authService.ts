import { auth, googleProvider } from "@/config/firebaseConfig";
import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { syncUserData } from "@/utils/syncUserData";
import type { CreateUser, SignInUser } from "@/types/user.types";

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

export const signUp = async (userData: CreateUser) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password,
    );

    const { email, password, ...additionalData } = userData;

    const data = await syncUserData(userCredential.user, additionalData);

    await updateProfile(userCredential.user, {
      displayName: `${userData.firstName} ${userData.lastName || ""}`.trim(),
      photoURL: userData.photoURL,
    });

    await sendEmailVerification(userCredential.user);

    return data;
  } catch (error) {
    console.error("Sign-Up Error:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    const data = await syncUserData(userCredential.user);

    return data;
  } catch (error) {
    console.error("Sign-In with Google Error:", error);
    throw error;
  }
};

export const signIn = async (userData: SignInUser) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password,
    );

    const data = await syncUserData(userCredential.user);

    return data;
  } catch (error) {
    console.error("Sign-In Error:", error);
    throw error;
  }
};

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user found.");
    }

    const credential = EmailAuthProvider.credential(
      user.email!,
      currentPassword,
    );

    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    await signOut();
  } catch (error) {
    console.error("Password Update Error:", error);
    throw error;
  }
};

export const createUserPassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Password Creation Error:", error);
    throw error;
  }
};

export const sendNewEmailVerification = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    await sendEmailVerification(user);
  } catch (error) {
    console.error("Email Verification Error:", error);
    throw error;
  }
};

export const completeEmailVerification = async (oobCode: string) => {
  try {
    await applyActionCode(auth, oobCode);
  } catch (error) {
    console.error("Email Verification Error:", error);
    throw error;
  }
};

export const sendNewPasswordResetEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password Reset Error:", error);
    throw error;
  }
};

export const completePasswordReset = async (
  oobCode: string,
  newPassword: string,
) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    console.error("Password Reset Confirmation Error:", error);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");
    await deleteUser(user);
    await signOut();
  } catch (error) {
    console.error("Delete Account Error:", error);
    throw error;
  }
};
