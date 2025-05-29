// Represents the authenticated user from Firebase Auth
export interface AuthUser {
  uid: string | undefined;
  username: string | undefined;
  fullName?: string;
  bio?: string;
  pfpUrl?: string;
}

// Represents a user profile stored in Firestore
export interface FirestoreUser {
  uid: string;
  username: string;
  fullName: string;
  bio?: string;
  pfpUrl?: string;
  email: string;
}
