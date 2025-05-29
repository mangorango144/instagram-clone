import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { GoSmiley } from "react-icons/go";
import { db } from "../../../config";
import { useSelector } from "react-redux";
import { PostType } from "../../../types";

interface AddCommentFormProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  post: PostType;
}

export function AddCommentForm({ textareaRef, post }: AddCommentFormProps) {
  const [text, setText] = useState("");
  const authUser = useSelector((state: any) => state.auth);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 112) + "px"; // cap to ~4 rows
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    console.log("Submitting comment:", text);

    if (!post.postId || !authUser) return;

    const postRef = doc(db, "posts", post.postId);

    const newComment = {
      uid: authUser.uid,
      username: authUser.username,
      text: text.trim(),
      createdAt: Timestamp.now(),
      likes: [],
      replies: [],
      pfpUrl: authUser.pfpUrl || "",
    };

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      return;
    }

    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      <GoSmiley className="text-[30px] text-white hover:cursor-pointer" />

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInput}
        name="comment_input"
        placeholder="Add a comment..."
        className="bg-transparent outline-none w-full max-h-[112px] text-white leading-snug resize-none"
        rows={1}
      />

      <button
        type="submit"
        disabled={!text.trim()}
        className={`rounded-md text-sm font-semibold ${
          text.trim()
            ? "text-sky-500 hover:cursor-pointer hover:text-white"
            : "text-stone-500"
        }`}
      >
        Post
      </button>
    </form>
  );
}
