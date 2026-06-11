import { auth, googleProvider } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { syncUserData } from "@/utils/syncUserData";
import type { CreateUser, SignInUser } from "@/types/user";

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

    await sendEmailVerification(userCredential.user);

    const data = await syncUserData(userCredential.user);

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
