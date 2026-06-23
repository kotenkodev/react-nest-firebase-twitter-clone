import { auth, googleProvider } from "@/config/firebaseConfig";
import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile,
  linkWithCredential,
  updatePhoneNumber as updateUserPhoneNumber,
  PhoneAuthProvider,
} from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import { syncUserData } from "@/utils/syncUserData";
import type { CreateUser, SignInUser } from "@/types/user.types";
import apiClient from "./apiClient";

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

export const signUp = async (
  userData: CreateUser & { confirmPassword?: string },
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password,
    );

    const { email, password, confirmPassword, ...additionalData } = userData;

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

export const verifyPhoneForUpdate = async (
  phoneNumber: string,
  appVerifier: any,
): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    const provider = new PhoneAuthProvider(auth);
    return await provider.verifyPhoneNumber(phoneNumber, appVerifier);
  } catch (error) {
    console.error("Verify Phone Number Error:", error);
    throw error;
  }
};

export const linkOrUpdatePhone = async (
  verificationId: string,
  otpCode: string,
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    const credential = PhoneAuthProvider.credential(verificationId, otpCode);
    const hasPhoneProvider = user.providerData.some(
      (p) => p.providerId === "phone",
    );

    if (hasPhoneProvider) {
      await updateUserPhoneNumber(user, credential);
    } else {
      await linkWithCredential(user, credential);
    }

    await user.reload();
    return auth.currentUser;
  } catch (error) {
    console.error("Confirm Phone Link/Update Error:", error);
    throw error;
  }
};

export const signInWithPhone = async (
  confirmationResult: ConfirmationResult,
  otpCode: string,
) => {
  try {
    const result = await confirmationResult.confirm(otpCode);
    const data = await syncUserData(result.user);
    return data;
  } catch (error) {
    console.error("Sign-In with Phone Error:", error);
    throw error;
  }
};

export const checkPhoneNumberExists = async (
  phoneNumber: string,
): Promise<boolean> => {
  try {
    const response = await apiClient.post<{ exists: boolean }>(
      "/auth/check-phone",
      {
        phoneNumber,
      },
    );
    return response.data.exists;
  } catch (error) {
    console.error("Check Phone Number Error:", error);
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
    const response = await apiClient.post("/auth/verify-email", {
      email: user.email!,
    });

    console.log(response.data);
  } catch (error) {
    console.error("Email Verification Error:", error);
    throw error;
  }
};

export const completeEmailVerification = async (oobCode: string) => {
  try {
    await applyActionCode(auth, oobCode);
    if (auth.currentUser) {
      await auth.currentUser.reload();
    }
  } catch (error) {
    console.error("Email Verification Error:", error);
    throw error;
  }
};

export const sendNewPasswordResetEmail = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    console.log(response.data);
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
    await signOut();
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
