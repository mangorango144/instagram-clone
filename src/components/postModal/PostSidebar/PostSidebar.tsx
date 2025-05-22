import { useRef } from "react";
import { AddCommentForm } from "./AddCommentForm";
import { CommentsList } from "./CommentsList";
import { PostActions } from "./PostActions";
import { PostCaption } from "./PostCaption";
import { PosterInfo } from "./PosterInfo";
import { PostType } from "../../../types";

interface PostSidebarProps {
  username: string;
  post: PostType;
}

export function PostSidebar({ username, post }: PostSidebarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col w-full lg:w-[350px] h-auto lg:h-[700px] text-white">
      {/* Top: Poster Info */}
      <PosterInfo username={username} />

      {/* Actions + Comment Form come first on small screens, last on lg */}
      <div className="flex flex-col space-y-3 order-1 lg:order-3 px-4 py-3 border-white/10 border-t">
        <PostActions
          likes={post.likes}
          createdAt={post.createdAt}
          onCommentClick={() => textareaRef.current?.focus()}
        />
        <AddCommentForm textareaRef={textareaRef} />
      </div>

      {/* Scrollable content: Caption + Comments */}
      <div className="flex-1 space-y-4 order-3 lg:order-2 px-4 py-4 border-white/10 border-t lg:border-none overflow-y-visible lg:overflow-y-auto hide-scrollbar">
        <PostCaption username={username} caption={post.caption} />
        <CommentsList comments={post.comments} />
      </div>
    </div>
  );
}
