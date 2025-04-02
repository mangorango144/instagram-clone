import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config";

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
