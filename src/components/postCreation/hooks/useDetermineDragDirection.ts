import { useEffect } from "react";

export const useDetermineDragDirection = (
  previewUrl: string | null,
  setDragDirection: React.Dispatch<
    React.SetStateAction<"horizontal" | "vertical" | "none">
  >
) => {
  useEffect(() => {
    if (!previewUrl) return;

    const img = new Image();
    img.src = previewUrl;

    img.onload = () => {
      if (img.naturalWidth > img.naturalHeight) {
        setDragDirection("horizontal");
      } else if (img.naturalHeight > img.naturalWidth) {
        setDragDirection("vertical");
      } else {
        setDragDirection("none");
      }
    };
  }, [previewUrl, setDragDirection]);
};
