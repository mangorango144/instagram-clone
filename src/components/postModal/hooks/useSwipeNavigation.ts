import { useEffect, useRef } from "react";

interface UseSwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

/**
 * Custom hook that enables horizontal swipe detection (left/right)
 * on a given container element and triggers callbacks accordingly.
 * Uses a useEffect to attach and clean up touch event listeners.
 */
export function useSwipeNavigation(
  containerRef: React.RefObject<HTMLElement | null>,
  { onSwipeLeft, onSwipeRight }: UseSwipeNavigationProps
) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const threshold = 50; // minimum swipe distance

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;

      if (touchStartX.current !== null && touchEndX.current !== null) {
        const diff = touchStartX.current - touchEndX.current;

        if (diff > threshold) {
          onSwipeLeft();
        } else if (diff < -threshold) {
          onSwipeRight();
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, onSwipeLeft, onSwipeRight]);
}
