import { FaRegHeart, FaRegComment, FaRegBookmark } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

type PostActionsProps = {
  likes: string[];
  createdAt: Timestamp;
  onCommentClick: () => void;
};

export function PostActions({
  likes,
  createdAt,
  onCommentClick,
}: PostActionsProps) {
  const date = createdAt.toDate();
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

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

      <div className="mt-2 font-semibold text-white text-sm">
        {likes.length} likes
      </div>

      <time dateTime={date.toISOString()} className="text-stone-400 text-xs">
        {relativeTime}
      </time>
    </div>
  );
}
