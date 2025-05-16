import { useEffect, useRef, useState } from "react";

import { BsExclamationCircle } from "react-icons/bs";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { GoSmiley } from "react-icons/go";
import { ModalStage } from "../../constants";
import { emojiList } from "../../../../utils";

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

const MAX_CAPTION_LENGTH = 2200;

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
  // Filter overlay stuff
  const [showFilterOverlay, setShowFilterOverlay] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] =
    useState<keyof typeof filters>("Original");

  // Final stage caption stuff
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Calculate the new text length if the emoji is inserted
    const newTextLength = caption.length - (end - start) + emoji.length;

    if (newTextLength > MAX_CAPTION_LENGTH) {
      return; // Don't insert the emoji if it exceeds max length
    }

    const newText =
      caption.substring(0, start) + emoji + caption.substring(end);

    setCaption(newText);

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    });

    setShowEmojiPicker(false);
  };

  // Reset filter when previewUrl changes
  useEffect(() => {
    if (previewUrl) {
      setSelectedFilter("Original");
    }
  }, [previewUrl]);

  // Show filter overlay when modal stage is Edit
  useEffect(() => {
    if (modalStage === ModalStage.Edit) {
      setShowFilterOverlay(true);
    }
  }, [modalStage]);

  // Close emoji picker if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount or when showEmojiPicker changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

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

            {/* Caption overlay */}
            {modalStage === ModalStage.Final && (
              <div className="top-3 right-3 left-3 absolute bg-neutral-800 px-5 pt-3 pb-3 rounded-xl">
                <span className="font-medium text-stone-400">
                  Add a caption
                </span>
                <textarea
                  ref={textareaRef}
                  name="caption"
                  maxLength={MAX_CAPTION_LENGTH}
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-2 outline-none w-full h-30 text-sm resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <div
                    ref={pickerRef}
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="flex items-center space-x-2"
                  >
                    <GoSmiley className="text-stone-400 text-2xl hover:cursor-pointer" />

                    {showEmojiPicker && (
                      <div className="top-full left-0 z-50 absolute gap-2 grid grid-cols-8 md:grid-cols-6 bg-stone-800 mt-2 p-2 rounded-xl">
                        {emojiList.map((emoji) => (
                          <button
                            key={emoji}
                            className="md:text-xl hover:scale-130 transition hover:cursor-pointer"
                            onClick={() => addEmoji(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-stone-400 text-sm">
                    {caption.length}/{MAX_CAPTION_LENGTH}
                  </span>
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
