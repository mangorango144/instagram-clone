import { Timestamp } from "firebase/firestore";
import { FirestoreUser } from "./user";

export interface ReplyType {
  uid: string;
  username: string;
  text: string;
  createdAt: Timestamp;
  likes: FirestoreUser[];
  imageUrl: string;
}

export interface CommentType {
  uid: string;
  username: string;
  text: string;
  createdAt: Timestamp;
  pfpUrl: string;
  likes: FirestoreUser[];
  replies: ReplyType[];
}
