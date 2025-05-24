import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import {
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { UserListModal } from "../../UserListModal";
import { useEffect, useState } from "react";
import { FirestoreUser, PostType } from "../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../../config";
import { getUserByUid } from "../../../utils";

type PostActionsProps = {
  likes: FirestoreUser[];
  createdAt: Timestamp;
  onCommentClick: () => void;
  authUserFollowings: Map<string, FirestoreUser>;
  setAuthUserFollowings: (followings: Map<string, FirestoreUser>) => void;
  currentUserPage: FirestoreUser;
  fetchFollowersAndFollowing: (uid: string) => Promise<void>;
  post: PostType;
};

export function PostActions({
  likes,
  createdAt,
  onCommentClick,
  authUserFollowings,
  setAuthUserFollowings,
  currentUserPage,
  fetchFollowersAndFollowing,
  post,
}: PostActionsProps) {
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState<FirestoreUser[]>(likes);
  const [isSaved, setIsSaved] = useState(false);

  const authUser = useSelector((state: RootState) => state.auth);

  const date = createdAt.toDate();
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  const hasLiked = localLikes.some(
    (user) => user.username === authUser.username
  );

  const handleLikeToggle = async () => {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("uid", "==", post.postId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("No post found with uid:", post.postId);
        return;
      }

      const postDocRef = querySnapshot.docs[0].ref;

      if (hasLiked) {
        const fullAuthUser = await getUserByUid(authUser.uid as string);
        if (!fullAuthUser) return;

        await updateDoc(postDocRef, {
          likes: arrayRemove(fullAuthUser),
        });

        setLocalLikes((prev) =>
          prev.filter((user) => user.uid !== fullAuthUser.uid)
        );
      } else {
        const fullUser = await getUserByUid(authUser.uid as string);
        if (!fullUser) return;

        await updateDoc(postDocRef, {
          likes: arrayUnion(fullUser),
        });

        setLocalLikes((prev) => [...prev, fullUser]);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleSavePost = async () => {
    try {
      const savedPostsRef = collection(db, "savedPosts");
      const q = query(
        savedPostsRef,
        where("userId", "==", authUser.uid),
        where("postId", "==", post.postId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If post is not saved yet, add it
        await addDoc(savedPostsRef, {
          userId: authUser.uid,
          postId: post.postId,
          savedAt: serverTimestamp(),
        });
        setIsSaved(true);
        console.log("Post saved!");
      } else {
        // If post is already saved, remove it
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, "savedPosts", docId));
        setIsSaved(false);
        console.log("Post unsaved!");
      }
    } catch (error) {
      console.error("Error saving/removing post:", error);
    }
  };

  useEffect(() => {
    setLocalLikes(likes);
  }, [likes]);

  useEffect(() => {
    const checkIfSaved = async () => {
      const savedPostsRef = collection(db, "savedPosts");
      const q = query(
        savedPostsRef,
        where("userId", "==", authUser.uid),
        where("postId", "==", post.postId)
      );

      const querySnapshot = await getDocs(q);
      setIsSaved(!querySnapshot.empty);
    };

    checkIfSaved();
  }, [authUser.uid, post.postId]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-start items-center text-[24px] text-white">
        {hasLiked ? (
          <FaHeart
            className="text-red-500 hover:cursor-pointer"
            onClick={handleLikeToggle}
          />
        ) : (
          <FaRegHeart
            className="hover:cursor-pointer"
            onClick={handleLikeToggle}
          />
        )}

        <FaRegComment
          className="mx-5 hover:cursor-pointer"
          onClick={onCommentClick}
        />

        <FiSend className="hover:cursor-pointer" />

        {isSaved ? (
          <FaBookmark
            className="ml-auto hover:cursor-pointer"
            onClick={handleSavePost}
          />
        ) : (
          <FaRegBookmark
            className="ml-auto hover:cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>

      <span
        className="mt-2 w-fit font-semibold text-white text-sm hover:cursor-pointer"
        onClick={() => setLikesModalOpen(true)}
      >
        {localLikes.length} likes
      </span>

      <time dateTime={date.toISOString()} className="text-stone-400 text-xs">
        {relativeTime}
      </time>

      {likesModalOpen && (
        <UserListModal
          title={"Likes"}
          users={localLikes}
          authUserFollowings={authUserFollowings}
          setAuthUserFollowings={setAuthUserFollowings}
          currentUserPage={currentUserPage}
          fetchFollowersAndFollowing={fetchFollowersAndFollowing}
          onClose={() => setLikesModalOpen(false)}
        />
      )}
    </div>
  );
}
