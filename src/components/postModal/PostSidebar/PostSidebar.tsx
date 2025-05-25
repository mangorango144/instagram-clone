import { useRef } from "react";
import { AddCommentForm } from "./AddCommentForm";
import { CommentsList } from "./CommentsList";
import { PostActions } from "./PostActions";
import { PostCaption } from "./PostCaption";
import { PosterInfo } from "./PosterInfo";
import { FirestoreUser, PostType } from "../../../types";

interface PostSidebarProps {
  username: string;
  post: PostType;
  authUserFollowings: Map<string, FirestoreUser>;
  setAuthUserFollowings: (followings: Map<string, FirestoreUser>) => void;
  currentUserPage: FirestoreUser;
  fetchFollowersAndFollowing: (uid: string) => Promise<void>;
}

export function PostSidebar({
  username,
  post,
  authUserFollowings,
  setAuthUserFollowings,
  currentUserPage,
  fetchFollowersAndFollowing,
}: PostSidebarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col w-full lg:w-[350px] h-auto lg:h-[700px] text-white">
      {/* Top: Poster Info */}
      <PosterInfo post={post} />

      {/* Actions + Comment Form come first on small screens, last on lg */}
      <div className="flex flex-col space-y-3 order-1 lg:order-3 px-4 py-3 border-white/10 border-t">
        <PostActions
          likes={post.likes}
          createdAt={post.createdAt}
          onCommentClick={() => textareaRef.current?.focus()}
          authUserFollowings={authUserFollowings}
          setAuthUserFollowings={setAuthUserFollowings}
          currentUserPage={currentUserPage}
          fetchFollowersAndFollowing={fetchFollowersAndFollowing}
          post={post}
        />
        <AddCommentForm textareaRef={textareaRef} post={post} />
      </div>

      {/* Scrollable content: Caption + Comments */}
      <div className="flex-1 space-y-4 order-3 lg:order-2 px-4 py-4 border-white/10 border-t lg:border-none overflow-y-visible lg:overflow-y-auto hide-scrollbar">
        <PostCaption post={post} />
        <CommentsList comments={post.comments} postId={post.postId} />
      </div>
    </div>
  );
}
