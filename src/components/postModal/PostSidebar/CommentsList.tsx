import { GoHeart, GoHeartFill } from "react-icons/go";
import { CommentType } from "../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getUserByUid } from "../../../utils";
import { db } from "../../../config";

export function CommentsList({
  comments: initialComments,
  postId,
}: {
  comments: CommentType[];
  postId: string;
}) {
  const authUser = useSelector((state: RootState) => state.auth);
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [loading, setLoading] = useState(true);

  const hasUserLiked = (comment: CommentType) => {
    return comment.likes.some((user) => user.username === authUser.username);
  };

  const handleCommentLike = async (index: number) => {
    try {
      const fullAuthUser = await getUserByUid(authUser.uid as string);
      if (!fullAuthUser) return;

      // Optimistic UI update
      setComments((prev) =>
        prev.map((comment, i) => {
          if (i !== index) return comment;

          const alreadyLiked = hasUserLiked(comment);

          const updatedLikes = alreadyLiked
            ? comment.likes.filter((u) => u.username !== fullAuthUser.username)
            : [...comment.likes, fullAuthUser];

          return {
            ...comment,
            likes: updatedLikes,
          };
        })
      );

      // Fetch latest post document
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) return;

      const postData = postSnap.data();
      const currentComments = postData.comments || [];

      const updatedComments = currentComments.map(
        (comment: CommentType, i: number) => {
          if (i !== index) return comment;

          const alreadyLiked = comment.likes.some(
            (u) => u.username === fullAuthUser.username
          );

          const newLikes = alreadyLiked
            ? comment.likes.filter((u) => u.username !== fullAuthUser.username)
            : [...comment.likes, fullAuthUser];

          return {
            ...comment,
            likes: newLikes,
          };
        }
      );

      // Write back updated comments array
      await updateDoc(postRef, {
        comments: updatedComments,
      });
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  // Fetch comments from Firestore on mount or when postId changes
  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) {
          setComments([]);
          setLoading(false);
          return;
        }
        const postData = postSnap.data();
        setComments(postData.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  // useEffect(() => {
  //   setComments(initialComments);
  // }, [initialComments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-9">
        {/* Simple spinner */}
        <div className="border-4 border-white border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-7 mt-9 text-sm">
      {comments.map((comment, index) => (
        <div key={index} className="flex justify-start items-center">
          <div className="bg-stone-500 mb-auto rounded-full min-w-9 size-9"></div>

          <div className="flex flex-col ml-3">
            <p className="text-white break-all whitespace-pre-wrap">
              <span className="font-semibold">{comment.username}</span>{" "}
              <span className="text-white/87">{comment.text}</span>
            </p>
            <div className="flex space-x-3 mt-1 font-medium text-stone-400 text-xs">
              <span>1w</span>
              <span>{comment.likes.length} likes</span>
              <span className="hover:cursor-pointer">Reply</span>
            </div>
          </div>

          <span
            className="mt-1 mb-auto ml-auto text-[15px] hover:scale-110 active:scale-70 transition-transform duration-200 ease-in-out cursor-pointer"
            onClick={() => handleCommentLike(index)}
          >
            {hasUserLiked(comment) ? (
              <GoHeartFill className="ml-2 text-red-500 scale-110 transition-all duration-200" />
            ) : (
              <GoHeart className="ml-2 text-white/87 scale-100 transition-all duration-200" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
