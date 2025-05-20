// Filters used in the post upload process (Vanilla CSS)
// Canvas doesn't support Tailwind CSS classes, so we need to use vanilla CSS filters.
const canvasFilters = {
  Original: "none",
  Aden: "brightness(110%) sepia(1)",
  Clarendron: "contrast(125%) hue-rotate(15deg)",
  Crema: "grayscale(10%) brightness(105%)",
  Gingham: "brightness(105%) contrast(90%)",
  Juno: "saturate(150%) contrast(110%)",
  Lark: "brightness(105%) contrast(105%) saturate(120%)",
  Ludwig: "brightness(120%) contrast(85%)",
  Moon: "grayscale(100%)",
  Perpetua: "hue-rotate(180deg) contrast(90%)",
  Reyes: "sepia(1) brightness(110%)",
  Slumber: "brightness(95%) saturate(80%) sepia(1)",
} as const;

export const getCroppedImageBlob = (
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  filter: keyof typeof canvasFilters
): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.reject(new Error("Failed to get canvas context"));
  }

  ctx.filter = canvasFilters[filter];

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas is empty"));
    }, "image/jpeg");
  });
};
