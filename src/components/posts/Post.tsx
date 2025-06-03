import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { db } from "../../config";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FirestoreUser, PostType } from "../../types";
import { formatDistanceToNow } from "date-fns";
import { getUserByUid, getUsernameByUid } from "../../utils";

interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [localLikes, setLocalLikes] = useState<FirestoreUser[]>(post.likes);

  const authUser = useSelector((state: RootState) => state.auth);

  const date = post.createdAt.toDate();
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  const hasLiked = localLikes.some(
    (user) => user.username === authUser.username
  );

  const handleLikeToggle = async () => {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("uid", "==", post.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("No post found with uid:", post.uid);
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
    async function fetchUsername() {
      const name = await getUsernameByUid(post.uid);
      setUsername(name ?? null);
    }
    fetchUsername();
  }, [post.uid]);

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
    <div className="bg-black mx-auto border border-neutral-800 rounded-lg w-full max-w-md overflow-hidden text-white">
      {/* Post Header */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <img
            src={post.pfpUrl || "/assets/blank_pfp.png"}
            alt="Profile"
            className="rounded-full size-8 object-cover"
          />
          <div className="ml-3 font-semibold text-sm">{username}</div>
          <div className="bg-white/70 mx-1.5 rounded-full size-[4px]"></div>
          <div className="text-neutral-400 text-sm">{relativeTime}</div>
        </div>
      </div>

      {/* Image */}
      <div>
        <img
          src={post.imageUrl}
          alt="Post Image"
          className="w-full object-cover"
        />
      </div>

      {/* Post actions */}
      <div className="px-4 py-3 border-neutral-800 border-t text-neutral-400 text-sm">
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
            // onClick={onCommentClick}
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

        <div
          className="mt-2 w-fit font-semibold text-white text-sm hover:cursor-pointer"
          // onClick={() => setLikesModalOpen(true)}
        >
          {localLikes.length} likes
        </div>

        <div className="mt-2 mb-1">
          <span className="font-semibold text-white">{username}</span>
          <span className="ml-1 text-white/87">{post.caption}</span>
        </div>
        <div className="mb-1">View all {post.comments.length} comments</div>
        <div>Add a comment...</div>
      </div>
    </div>
  );
}
