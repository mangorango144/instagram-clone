import { BsExclamationCircle } from "react-icons/bs";
import { LiaPhotoVideoSolid } from "react-icons/lia";

type MediaStageProps = {
  isDraggingFile: boolean;
  errorMessage: string | null;
  previewUrl: string | null;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
  draggableImageRef: React.RefObject<HTMLImageElement | null>;
  dragDirection: "horizontal" | "vertical" | "none";
  isDraggingImage: boolean;
  handleFileSelectClick: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchDown: (e: React.TouchEvent) => void;
  handleImageLoad: (image: HTMLImageElement, container: HTMLElement) => void;
};

export function MediaStage({
  isDraggingFile,
  errorMessage,
  previewUrl,
  previewContainerRef,
  draggableImageRef,
  dragDirection,
  isDraggingImage,
  handleFileSelectClick,
  handleMouseDown,
  handleTouchDown,
  handleImageLoad,
}: MediaStageProps) {
  return (
    <div
      className={`flex flex-col flex-grow justify-center items-center space-y-4 text-white ${
        isDraggingFile ? "border-1 border-sky-500" : ""
      }`}
    >
      {errorMessage ? (
        <>
          <BsExclamationCircle className="text-[80px]" />
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xl">This file is not supported</span>
            <span className="text-stone-400 text-xs md:text-sm text-center">
              {errorMessage}
            </span>
          </div>
          <button
            onClick={handleFileSelectClick}
            className="bg-sky-500 hover:bg-sky-600 px-5 py-1.5 rounded-lg font-semibold text-sm cursor-pointer"
          >
            Select other files
          </button>
        </>
      ) : previewUrl ? (
        previewUrl.includes("video") ? (
          <video src={previewUrl} controls className="max-h-[300px]" />
        ) : (
          <div
            ref={previewContainerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchDown}
            className={`relative flex-grow w-full h-full overflow-hidden ${
              isDraggingImage ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <img
              ref={draggableImageRef}
              src={previewUrl}
              onLoad={() =>
                handleImageLoad(
                  draggableImageRef.current!,
                  previewContainerRef.current!
                )
              }
              alt="preview"
              className={`absolute top-0 left-0 select-none ${
                dragDirection === "horizontal"
                  ? "h-full max-w-none max-h-none"
                  : dragDirection === "vertical"
                  ? "w-full max-w-none max-h-none"
                  : ""
              }`}
              draggable={false}
            />
            {isDraggingImage && (
              <div className="z-10 absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/30" />
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        <>
          <LiaPhotoVideoSolid className="text-[80px]" />
          <span className="text-xl">Drag photos and videos here</span>
          <button
            onClick={handleFileSelectClick}
            className="bg-sky-500 hover:bg-sky-600 px-5 py-1.5 rounded-lg font-semibold text-sm cursor-pointer"
          >
            Select from computer
          </button>
        </>
      )}
    </div>
  );
}
