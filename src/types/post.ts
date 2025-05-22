import { Timestamp } from "firebase/firestore";

export interface PostType {
  id: string;
  uid: string;
  caption: string;
  imageUrl: string;
  createdAt: Timestamp;
  likes: string[];
  comments: string[];
}
