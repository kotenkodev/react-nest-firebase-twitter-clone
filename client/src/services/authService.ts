import { auth, googleProvider } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import apiClient from "./apiClient";
import type { CreateUserForm, SignInForm } from "@/types/user";

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

export const signUp = async (userData: CreateUserForm) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password,
    );

    await updateProfile(userCredential.user, {
      displayName: `${userData.firstName} ${userData.lastName}`,
    });

    const response = await apiClient.post(`/auth/signup`, {
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    await sendEmailVerification(userCredential.user);

    return response.data;
  } catch (error) {
    console.error("Sign-Up Error:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);

    const response = await apiClient.post(`/auth/signin`);

    return response.data;
  } catch (error) {
    console.error("Sign-In with Google Error:", error);
    throw error;
  }
};

export const signIn = async (userData: SignInForm) => {
  try {
    await signInWithEmailAndPassword(auth, userData.email, userData.password);

    const response = await apiClient.post(`/auth/signin`);

    return response.data;
  } catch (error) {
    console.error("Sign-In Error:", error);
    throw error;
  }
};
