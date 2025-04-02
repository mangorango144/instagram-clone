// Represents the authenticated user from Firebase Auth
export interface AuthUser {
  uid: string | undefined;
}

// Represents a user profile stored in Firestore
export interface FirestoreUser {
  uid: string;
  username: string;
  fullName: string;
  email: string;
}
