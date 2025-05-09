import { useCallback, useState } from "react";

type Dimensions = { width: number; height: number };
type DragDirection = "horizontal" | "vertical" | "none";
type Offset = { x: number; y: number };

export function useImageDragInit(offsetRef: React.RefObject<Offset>) {
  const [imageDimensions, setImageDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const [dragDirection, setDragDirection] = useState<DragDirection>("none");

  const handleImageLoad = useCallback(
    (image: HTMLImageElement, container: HTMLElement) => {
      const { naturalWidth, naturalHeight } = image;

      requestAnimationFrame(() => {
        const imageRect = image.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setImageDimensions({
          width: imageRect.width,
          height: imageRect.height,
        });
        setContainerDimensions({
          width: containerRect.width,
          height: containerRect.height,
        });

        if (naturalWidth > naturalHeight) {
          setDragDirection("horizontal");
        } else if (naturalHeight > naturalWidth) {
          setDragDirection("vertical");
        } else {
          setDragDirection("none");
        }

        image.style.transform = "translate(0px, 0px)";
        offsetRef.current = { x: 0, y: 0 };
      });
    },
    [offsetRef]
  );

  return {
    imageDimensions,
    containerDimensions,
    dragDirection,
    setDragDirection,
    handleImageLoad,
  };
}
