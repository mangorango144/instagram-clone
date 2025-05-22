import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PostNavigatorProps {
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalPosts: number;
}

export function PostNavigator({
  onNext,
  onPrev,
  currentIndex,
  totalPosts,
}: PostNavigatorProps) {
  return (
    <>
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="top-1/2 left-4 z-50 fixed bg-white p-2 rounded-full text-black hover:scale-125 transition-transform -translate-y-1/2 duration-200 hover:cursor-pointer"
          aria-label="Previous post"
        >
          <FaChevronLeft className="text-xl" />
        </button>
      )}

      {currentIndex < totalPosts - 1 && (
        <button
          onClick={onNext}
          className="top-1/2 right-4 z-50 fixed bg-white p-2 rounded-full text-black hover:scale-125 transition-transform -translate-y-1/2 duration-200 hover:cursor-pointer"
          aria-label="Next post"
        >
          <FaChevronRight className="text-xl" />
        </button>
      )}
    </>
  );
}
