import { useState } from "react";
import { GoSmiley } from "react-icons/go";

interface AddCommentFormProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function AddCommentForm({ textareaRef }: AddCommentFormProps) {
  const [text, setText] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 112) + "px"; // cap to ~4 rows
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    console.log("Submitting comment:", text);
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
