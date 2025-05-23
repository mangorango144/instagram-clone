import { Timestamp } from "firebase/firestore";
import { FirestoreUser } from "./user";

export interface PostType {
  id: string;
  uid: string;
  caption: string;
  imageUrl: string;
  createdAt: Timestamp;
  likes: FirestoreUser[];
  comments: string[];
}
