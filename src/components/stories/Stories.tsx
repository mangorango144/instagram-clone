import { useEffect, useRef, useState } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

export function Stories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_WIDTH = 56 + 22; // 56px for story size, 22px margin
  const SCROLL_COUNT = 4;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const container = containerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth
    );
  };

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left:
        direction === "left"
          ? -ITEM_WIDTH * SCROLL_COUNT
          : ITEM_WIDTH * SCROLL_COUNT,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateScrollButtons(); // Initial check
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons);
    return () => container.removeEventListener("scroll", updateScrollButtons);
  }, []);

  return (
    <div className="relative w-full">
      {/* Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="top-1/2 left-5 z-10 absolute rounded-full -translate-y-1/2 cursor-pointer"
        >
          <FaCircleChevronLeft className="text-white text-xl" />
        </button>
      )}

      {/* Scrollable container */}
      <div className="overflow-x-auto hide-scrollbar" ref={containerRef}>
        <div className="flex items-center bg-black pl-2.5 min-w-max h-[84px]">
          {Array.from({ length: 18 }, (_, i) => (
            <div key={i} className="mr-[14px] cursor-pointer shrink-0">
              <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:brightness-110 p-[4px] rounded-full transition">
                <div className="flex justify-center items-center bg-stone-600 rounded-full outline-2 outline-black size-[56px] text-white">
                  {i + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="top-1/2 right-5 z-10 absolute rounded-full -translate-y-1/2 cursor-pointer"
        >
          <FaCircleChevronRight className="text-white text-xl" />
        </button>
      )}
    </div>
  );
}
