import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa";

type PostActionsProps = {
  onCommentClick: () => void;
};

export function PostActions({ onCommentClick }: PostActionsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-start items-center text-[24px] text-white">
        <FaRegHeart className="hover:cursor-pointer" />
        <FaRegComment
          className="mx-5 hover:cursor-pointer"
          onClick={onCommentClick}
        />
        <FiSend className="hover:cursor-pointer" />
        <FaRegBookmark className="ml-auto hover:cursor-pointer" />
      </div>

      <div className="mt-2 font-semibold text-white text-sm">780 likes</div>
      <div className="text-stone-400 text-xs">5 days ago</div>
    </div>
  );
}
