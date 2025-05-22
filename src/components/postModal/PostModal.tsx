import React, { useRef } from "react";
import { PostImage } from "./PostImage";
import { PostSidebar } from "./PostSidebar";
import { CloseButton } from "../CloseButton";
import { PostNavigator } from "./PostNavigator";
import { PostType } from "../../types";
import {
  useArrowNavigation,
  useModalBehavior,
  useSwipeNavigation,
} from "./hooks";

interface PostModalProps {
  posts: PostType[];
  username: string;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

export function PostModal({
  posts,
  username,
  currentIndex,
  setCurrentIndex,
  onClose,
}: PostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigatorRef = useRef<HTMLDivElement>(null);

  const onNext = () =>
    setCurrentIndex((i) => Math.min(i + 1, posts.length - 1));
  const onPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  // Closes modal on Escape key press and disables body scroll while modal is open (uses useEffect)
  useModalBehavior(onClose);

  // Navigates between posts with arrow keys (uses useEffect)
  useArrowNavigation(onPrev, onNext);

  // Enables swipe gestures on the modal to navigate between posts (uses useEffect internally)
  useSwipeNavigation(modalRef, {
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Node;
    if (
      modalRef.current &&
      !modalRef.current.contains(target) &&
      navigatorRef.current &&
      !navigatorRef.current.contains(target)
    ) {
      onClose();
    }
  };

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 py-5 overflow-y-auto custom-scrollbar"
      onClick={handleBackdropClick}
    >
      <CloseButton onClose={onClose} extraClasses="hidden lg:block" />
      <div
        ref={modalRef}
        className="flex lg:flex-row flex-col bg-stone-900 my-auto rounded-xl lg:rounded-none w-[90%] lg:w-[1050px] h-auto lg:h-[700px] overflow-hidden"
      >
        <PostImage imageUrl={posts[currentIndex].imageUrl} />
        <PostSidebar username={username} post={posts[currentIndex]} />
      </div>

      <div ref={navigatorRef} className="hidden lg:block">
        <PostNavigator
          currentIndex={currentIndex}
          totalPosts={posts.length}
          onNext={onNext}
          onPrev={onPrev}
        />
      </div>
    </div>
  );
}
