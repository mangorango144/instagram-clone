import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config";
import { FirestoreUser } from "../types";

export const getEmailFromUsername = async (
  username: string
): Promise<string | null> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().email;
    }
  } catch (error: any) {
    console.error("Error fetching email from username:", error.message);
  }
  return null;
};

export const getUsernameByUid = async (
  uid: string
): Promise<string | undefined> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.username as string;
    }
  } catch (error) {
    console.error("Error fetching username:", error);
  }
  return undefined;
};

export const searchUsersByUsernameOrName = async (
  queryStr: string
): Promise<FirestoreUser[]> => {
  if (!queryStr) return [];

  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("searchKeywords", "array-contains", queryStr.toLowerCase())
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...(doc.data() as Omit<FirestoreUser, "uid">),
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};
