import { useEffect, useRef } from "react";
import { PostImage } from "./PostImage";
import { PostSidebar } from "./PostSidebar";

interface PostModalProps {
  onClose: () => void;
}

export function PostModal({ onClose }: PostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore original body overflow style
      document.body.style.overflow = originalStyle;
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // if click target is outside modal content
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 py-5 overflow-y-auto custom-scrollbar"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="flex lg:flex-row flex-col bg-stone-900 my-auto w-[90%] lg:w-[1050px] h-auto lg:h-[700px]"
      >
        <PostImage />
        <PostSidebar />
      </div>
    </div>
  );
}
