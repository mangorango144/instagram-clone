import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
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

export const followUser = async (followerId: string, followingId: string) => {
  try {
    await addDoc(collection(db, "follows"), {
      followerId,
      followingId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error following user:", error);
  }
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  try {
    const q = query(
      collection(db, "follows"),
      where("followerId", "==", followerId),
      where("followingId", "==", followingId)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
};

// Get followers of a user
export const getFollowers = async (
  userId: string
): Promise<FirestoreUser[]> => {
  const q = query(
    collection(db, "follows"),
    where("followingId", "==", userId)
  );
  const snapshot = await getDocs(q);

  const followerIds = snapshot.docs.map((doc) => doc.data().followerId);

  // Fetch user details for each followerId
  const userPromises = followerIds.map(async (id) => {
    const userDoc = await getDoc(doc(db, "users", id));
    if (userDoc.exists()) {
      return {
        uid: id,
        ...(userDoc.data() as Omit<FirestoreUser, "uid">),
      };
    }
    return null;
  });

  const users = await Promise.all(userPromises);
  return users.filter((user): user is FirestoreUser => user !== null); // Filter out null values
};

// Get followings of a user
export const getFollowing = async (
  userId: string
): Promise<FirestoreUser[]> => {
  const q = query(collection(db, "follows"), where("followerId", "==", userId));
  const snapshot = await getDocs(q);

  const followingIds = snapshot.docs.map((doc) => doc.data().followingId);

  // Fetch user details for each followingId
  const userPromises = followingIds.map(async (id) => {
    const userDoc = await getDoc(doc(db, "users", id));
    if (userDoc.exists()) {
      return {
        uid: id,
        ...(userDoc.data() as Omit<FirestoreUser, "uid">),
      };
    }
    return null;
  });

  const users = await Promise.all(userPromises);
  return users.filter((user): user is FirestoreUser => user !== null); // Filter out null values
};
