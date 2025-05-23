import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { UserListModal } from "../../UserListModal";
import { useState } from "react";
import { FirestoreUser } from "../../../types";
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
  postUid: string;
};

export function PostActions({
  likes,
  createdAt,
  onCommentClick,
  authUserFollowings,
  setAuthUserFollowings,
  currentUserPage,
  fetchFollowersAndFollowing,
  postUid,
}: PostActionsProps) {
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState<FirestoreUser[]>(likes);

  const authUser = useSelector((state: RootState) => state.auth);

  const date = createdAt.toDate();
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  const hasLiked = localLikes.some(
    (user) => user.username === authUser.username
  );

  const handleLikeToggle = async () => {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("uid", "==", postUid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("No post found with uid:", postUid);
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
        <FaRegBookmark className="ml-auto hover:cursor-pointer" />
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
