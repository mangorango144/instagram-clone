import { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";

const mockComments = [
  {
    user: "rubenprozo51",
    text: "Part 4. PleaseFASDFSAFA FDFFAFDSFSDFSDFSFSAFSAFSADFDFSFSAFSAFDFSFSAFSAFDFSFSAFSAFDFSFSAFSAFDFSFSAFSAFDFSFSAFSAFDFSFSAFSAFDFSFSAFSAFDFSFSAFSAF",
  },
  { user: "vishal_daanbhi", text: "🔥" },
  { user: "astechnix_", text: "Well explained" },
];

export function CommentsList({ comments }: { comments: string[] }) {
  const repeatedComments = Array.from(
    { length: 20 },
    (_, i) => mockComments[i % mockComments.length]
  );

  const [likedStates, setLikedStates] = useState<boolean[]>(
    Array(repeatedComments.length).fill(false)
  );

  const toggleLike = (index: number) => {
    setLikedStates((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  return (
    <div className="space-y-7 mt-9 text-sm">
      {comments.map((comment, index) => (
        <div key={index} className="flex justify-start items-center">
          <div className="bg-stone-500 mb-auto rounded-full min-w-9 size-9"></div>

          <div className="flex flex-col ml-3">
            <p className="text-white break-all whitespace-pre-wrap">
              <span className="font-semibold">comment.user</span>{" "}
              <span className="text-white/87">comment.text</span>
            </p>
            <div className="flex space-x-3 mt-1 font-medium text-stone-400 text-xs">
              <span>1w</span>
              <span>1 like</span>
              <span className="hover:cursor-pointer">Reply</span>
            </div>
          </div>

          <span
            className="mt-1 mb-auto ml-auto text-[15px] hover:scale-110 active:scale-70 transition-transform duration-200 ease-in-out cursor-pointer"
            onClick={() => toggleLike(index)}
          >
            {likedStates[index] ? (
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
