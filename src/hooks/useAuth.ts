import { auth, googleProvider } from "../config";
import { getEmailFromUsername } from "../utils";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithRedirect,
  UserCredential,
} from "firebase/auth";

export const useAuth = () => {
  const signUp = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    }
  };

  const signIn = async (
    identifier: string, // Can be email or username
    password: string
  ): Promise<UserCredential | null> => {
    try {
      let email = identifier;

      // Check if identifier is an email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      if (!isEmail) {
        // Fetch email from Firestore using helper function
        const fetchedEmail = await getEmailFromUsername(identifier);
        if (!fetchedEmail) {
          console.error("Username not found");
          return null;
        }
        email = fetchedEmail;
      }

      return await signInWithEmailAndPassword(auth, email, password);
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

  // Expose logOut globally for testing
  (window as any).logOut = logOut;

  return { signUp, signIn, signInWithGoogle, logOut };
};
