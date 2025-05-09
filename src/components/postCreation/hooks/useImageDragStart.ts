type Position = { x: number; y: number };

export function useImageDragStart(
  offsetRef: React.RefObject<Position>,
  startPosRef: React.RefObject<Position>,
  setIsImageDragging: React.Dispatch<React.SetStateAction<boolean>>
) {
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsImageDragging(true);
    startPosRef.current = {
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    };
  };

  const handleTouchDown = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsImageDragging(true);
    startPosRef.current = {
      x: touch.clientX - offsetRef.current.x,
      y: touch.clientY - offsetRef.current.y,
    };
  };

  return { handleMouseDown, handleTouchDown };
}
