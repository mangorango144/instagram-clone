import { useEffect } from "react";

type Dimensions = { width: number; height: number };
type Offset = { x: number; y: number };

interface UseImageDraggingParams {
  isDraggingImage: boolean;
  dragDirection: "horizontal" | "vertical" | "none";
  imageDimensions: Dimensions;
  containerDimensions: Dimensions;
  offsetRef: React.RefObject<Offset>;
  startPosRef: React.RefObject<Offset>;
  draggableImageRef: React.RefObject<HTMLImageElement | null>;
  setIsImageDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useImageDragging({
  isDraggingImage,
  dragDirection,
  imageDimensions,
  containerDimensions,
  offsetRef,
  startPosRef,
  draggableImageRef,
  setIsImageDragging,
}: UseImageDraggingParams) {
  useEffect(() => {
    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const handleMove = (clientX: number, clientY: number) => {
      if (!isDraggingImage) return;

      let newOffsetX = clientX - startPosRef.current.x;
      let newOffsetY = clientY - startPosRef.current.y;

      const extraWidth = imageDimensions.width - containerDimensions.width;
      const extraHeight = imageDimensions.height - containerDimensions.height;

      const maxOffsetX = extraWidth;
      const maxOffsetY = extraHeight;

      if (dragDirection === "horizontal") {
        newOffsetY = 0;
        const clampedX = clamp(newOffsetX, -maxOffsetX, 0);
        if (newOffsetX !== clampedX) {
          startPosRef.current.x = clientX - clampedX;
        }
        newOffsetX = clampedX;
      } else if (dragDirection === "vertical") {
        newOffsetX = 0;
        const clampedY = clamp(newOffsetY, -maxOffsetY, 0);
        if (newOffsetY !== clampedY) {
          startPosRef.current.y = clientY - clampedY;
        }
        newOffsetY = clampedY;
      } else {
        newOffsetX = 0;
        newOffsetY = 0;
      }

      offsetRef.current = { x: newOffsetX, y: newOffsetY };

      if (draggableImageRef.current) {
        draggableImageRef.current.style.transform = `translate(${newOffsetX}px, ${newOffsetY}px)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const stopDragging = () => setIsImageDragging(false);

    if (isDraggingImage) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchend", stopDragging);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDraggingImage, dragDirection, imageDimensions, containerDimensions]);
}
