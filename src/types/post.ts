import { Timestamp } from "firebase/firestore";
import { FirestoreUser } from "./user";
import { CommentType } from "./comment";

export interface PostType {
  postId: string;
  uid: string;
  caption: string;
  imageUrl: string;
  createdAt: Timestamp;
  likes: FirestoreUser[];
  comments: CommentType[];
}
