import { useState, useEffect } from "react";
import { auth, googleProvider } from "../config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  signInWithRedirect,
  UserCredential,
} from "firebase/auth";

export const useAuth = () => {
  // User state with Firebase User type
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const signUp = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      return null;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const logOut = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Error signing out:", error.message);
    }
  };

  return { user, loading, signUp, signIn, signInWithGoogle, logOut };
};
