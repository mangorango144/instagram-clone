import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../config";
import { FirestoreUser } from "../types";
import {
  generateSearchKeywords,
  getEmailFromUsername,
  getUserByUid,
} from "../utils";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  signInWithPopup,
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

  const signInWithGoogle = async (): Promise<FirestoreUser | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      if (result?.user) {
        const uid = result.user.uid;
        let user = await getUserByUid(uid);

        if (!user) {
          const displayName = result.user.displayName || "user";
          const username = displayName.toLowerCase().replace(/\s+/g, "");
          const newUser: FirestoreUser = {
            uid,
            email: result.user.email || "",
            username,
            fullName: result.user.displayName || "",
            pfpUrl: result.user.photoURL || "",
          };

          const searchKeywords = generateSearchKeywords(
            result.user.displayName as string,
            username
          );

          await setDoc(doc(db, "users", uid), {
            fullName: result.user.displayName,
            username,
            email: result.user.email,
            createdAt: new Date(),
            searchKeywords,
            bio: "",
            pfpUrl: result.user.photoURL,
          });

          user = newUser;
        }

        return user;
      }

      return null;
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
      return null;
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
