import { useEffect, useRef, useState } from "react";

import { BsExclamationCircle } from "react-icons/bs";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { ModalStage } from "../../constants";

type MediaStageProps = {
  isDraggingFile: boolean;
  errorMessage: string | null;
  previewUrl: string | null;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
  draggableImageRef: React.RefObject<HTMLImageElement | null>;
  dragDirection: "horizontal" | "vertical" | "none";
  isDraggingImage: boolean;
  modalStage: ModalStage;
  handleFileSelectClick: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchDown: (e: React.TouchEvent) => void;
  handleImageLoad: (image: HTMLImageElement, container: HTMLElement) => void;
};

const filters = {
  Original: "",
  Aden: "filter brightness-110 sepia",
  Clarendron: "filter contrast-125 hue-rotate-15",
  Crema: "filter grayscale-10 brightness-105",
  Gingham: "filter brightness-105 contrast-90",
  Juno: "filter saturate-150 contrast-110",
  Lark: "filter brightness-105 contrast-105 saturate-120",
  Ludwig: "filter brightness-120 contrast-85",
  Moon: "filter grayscale",
  Perpetua: "filter hue-rotate-180 contrast-90",
  Reyes: "filter sepia brightness-110",
  Slumber: "filter brightness-95 saturate-80 sepia",
} as const;

export function MediaStage({
  isDraggingFile,
  errorMessage,
  previewUrl,
  previewContainerRef,
  draggableImageRef,
  dragDirection,
  isDraggingImage,
  modalStage,
  handleFileSelectClick,
  handleMouseDown,
  handleTouchDown,
  handleImageLoad,
}: MediaStageProps) {
  const [showFilterOverlay, setShowFilterOverlay] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] =
    useState<keyof typeof filters>("Original");

  useEffect(() => {
    if (previewUrl) {
      setSelectedFilter("Original");
    }
  }, [previewUrl]);

  useEffect(() => {
    if (modalStage === ModalStage.Edit) {
      setShowFilterOverlay(true);
    }
  }, [modalStage]);

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
              modalStage === ModalStage.Crop
                ? isDraggingImage
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-default"
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
                filters[selectedFilter]
              } ${
                dragDirection === "horizontal"
                  ? "h-full max-w-none max-h-none"
                  : dragDirection === "vertical"
                  ? "w-full max-w-none max-h-none"
                  : ""
              }`}
              draggable={false}
            />

            {/* Grid overlay for dragging */}
            {isDraggingImage && (
              <div className="z-10 absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white/30" />
                ))}
              </div>
            )}

            {/* Filter overlay */}
            {modalStage === ModalStage.Edit && (
              <div
                className={`right-0 bottom-0 left-0 absolute pt-8 ${
                  showFilterOverlay
                    ? "bg-gradient-to-t from-black to-transparent"
                    : ""
                }`}
              >
                <div
                  onClick={() => setShowFilterOverlay((prev) => !prev)}
                  className="top-0 right-0 absolute bg-black/50 hover:bg-black mr-3 px-3 rounded-lg font-medium text-sm md:text-base hover:cursor-pointer"
                >
                  {showFilterOverlay ? "Hide filters" : "Show filters"}
                </div>

                <div
                  className={`px-4 max-w-full overflow-x-auto ${
                    showFilterOverlay ? "" : "hidden"
                  }`}
                >
                  <div className="flex space-x-5 mb-4 w-max">
                    {Object.entries(filters).map(
                      ([filterName, filterClass]) => (
                        <div
                          key={filterName}
                          onClick={() =>
                            setSelectedFilter(
                              filterName as keyof typeof filters
                            )
                          }
                          className={`
                            size-20 md:size-30 cursor-pointer mt-1 relative text-white
                            ${
                              selectedFilter === filterName
                                ? "ring-3 ring-sky-500"
                                : ""
                            }
                            rounded-xl md:rounded-2xl
                          `}
                        >
                          <div
                            className={`
                              w-full h-full bg-cover bg-center rounded-xl md:rounded-2xl flex items-end justify-center text-[10px] md:text-[14px]
                              ${filterClass}
                            `}
                            style={{
                              backgroundImage: `url("/assets/filter_preview.jpg")`,
                            }}
                          >
                            <span className="bottom-1 absolute bg-black/40 px-1 rounded">
                              {filterName}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
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
