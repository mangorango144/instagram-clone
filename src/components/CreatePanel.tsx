import { useEffect, useRef, useState } from "react";

import { RiCloseLargeFill } from "react-icons/ri";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { BsExclamationCircle } from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io";

interface CreatePanelProps {
  onClose: () => void;
  toggleRef: React.RefObject<HTMLElement>;
}

export function CreatePanel({ onClose, toggleRef }: CreatePanelProps) {
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const discardModalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const draggableImageRef = useRef<HTMLImageElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const discardIntent = useRef<"close" | "back" | "bruh">("bruh");

  // Media State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UI State
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Drag Position State
  const [isDraggingImage, setIsImageDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<
    "horizontal" | "vertical" | "none"
  >("none");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Modal State
  const [modalStage, setModalStage] = useState(0); // 0: Upload, 1: Crop, 2: Edit, 3: Final
  const modalTitles = ["Create new post", "Crop", "Edit", "Create new post"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        (!toggleRef.current ||
          !toggleRef.current.contains(event.target as Node)) &&
        (!discardModalRef.current ||
          !discardModalRef.current.contains(event.target as Node))
      ) {
        handleCloseAttempt();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseAttempt();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    // Prevent body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);

      // Restore original body overflow style
      document.body.style.overflow = originalStyle;
    };
  }, [mediaFile, toggleRef]);

  // Handle dragging of the image
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
          startPosRef.current = {
            x: clientX - clampedX,
            y: startPosRef.current.y,
          };
        }
        newOffsetX = clampedX;
      } else if (dragDirection === "vertical") {
        newOffsetX = 0;
        const clampedY = clamp(newOffsetY, -maxOffsetY, 0);
        if (newOffsetY !== clampedY) {
          startPosRef.current = {
            x: startPosRef.current.x,
            y: clientY - clampedY,
          };
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

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const stopDragging = () => {
      setIsImageDragging(false);
    };

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

  // Determine drag direction based on image dimensions
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
  }, [previewUrl]);

  // Handle image load to set dimensions
  const handleImageLoad = () => {
    const image = draggableImageRef.current!;
    const container = previewContainerRef.current!;
    const { naturalWidth, naturalHeight } = image;

    // Ensure styles have been applied
    requestAnimationFrame(() => {
      const rect = image.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setImageDimensions({
        width: rect.width,
        height: rect.height,
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
  };

  const isValidMediaFile = (file: File) => {
    return file.type.startsWith("image/") || file.type.startsWith("video/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isValidMediaFile(file)) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setModalStage(1); // Advance to crop stage
      setErrorMessage(null);
    } else {
      setMediaFile(null);
      setPreviewUrl(null);
      setErrorMessage(
        `${file.name} could not be uploaded. This file is not supported.`
      );
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the value so same file triggers onChange
      fileInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (isValidMediaFile(file)) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    } else {
      setMediaFile(null);
      setPreviewUrl(null);
      setErrorMessage(
        `${file.name} could not be uploaded. This file is not supported.`
      );
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleCloseAttempt = () => {
    if (mediaFile) {
      discardIntent.current = "close";
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const confirmDiscard = () => {
    if (discardIntent.current === "close") {
      setShowDiscardModal(false);
      onClose();
    } else if (discardIntent.current === "back") {
      setMediaFile(null);
      setPreviewUrl(null);
      setModalStage(0); // Reset to upload stage
      setShowDiscardModal(false);
    }
  };

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

  const handlePrev = () => {
    if (modalStage === 1) {
      discardIntent.current = "back";
      setShowDiscardModal(true);
    } else {
      setModalStage((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`z-50 fixed inset-0 flex justify-center items-start bg-black/80 py-5 overflow-y-auto custom-scrollbar ${
        isDraggingImage ? "cursor-grabbing" : ""
      }`}
    >
      {/* Close Icon */}
      <RiCloseLargeFill
        onClick={handleCloseAttempt}
        className="right-5 absolute text-2xl hover:cursor-pointer"
      />

      <div
        ref={modalRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="flex flex-col bg-neutral-800 my-auto rounded-xl w-[348px] md:w-[690px] h-[397px] md:h-[739px]"
      >
        {/* Modal Header */}
        <div className="relative flex justify-center items-center p-3 border-stone-600 border-b text-white">
          {/* Prev Button: Hidden on stage 0 */}
          {modalStage > 0 && (
            <IoMdArrowBack
              onClick={handlePrev}
              className="left-6 absolute text-white text-3xl hover:cursor-pointer"
            />
          )}

          {/* Modal Title */}
          <span className="font-semibold text-md">
            {modalTitles[modalStage]}
          </span>

          {/* Next / Share Button */}
          {modalStage > 0 && modalStage < 3 && (
            <button
              onClick={() => setModalStage((prev) => Math.min(prev + 1, 3))}
              className="right-9 absolute font-semibold text-sky-500 hover:text-white text-sm hover:cursor-pointer"
            >
              Next
            </button>
          )}
          {modalStage === 3 && (
            <button
              // onClick={handleShare}
              className="right-9 absolute font-semibold text-sky-500 hover:text-white text-sm hover:cursor-pointer"
            >
              Share
            </button>
          )}
        </div>

        {/* Media section */}
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
                onClick={handleButtonClick}
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
                className={`relative flex-grow w-full h-full overflow-hidden cursor-grab ${
                  isDraggingImage ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                <img
                  ref={draggableImageRef}
                  src={previewUrl}
                  onLoad={handleImageLoad}
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
                {/* Overlay grid for dragging */}
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
                onClick={handleButtonClick}
                className="bg-sky-500 hover:bg-sky-600 px-5 py-1.5 rounded-lg font-semibold text-sm cursor-pointer"
              >
                Select from computer
              </button>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardModal && (
        <div
          ref={discardModalRef}
          className="z-60 absolute inset-0 flex justify-center items-center bg-black/50"
        >
          <div className="flex flex-col items-center bg-neutral-800 pt-6 rounded-xl w-[330px] text-white">
            <h2 className="font-base text-xl">Discard post?</h2>
            <span className="mb-6 pt-1 text-stone-400 text-sm text-center">
              If you leave, your edits won't be saved.
            </span>
            <div className="flex flex-col w-full text-sm">
              <button
                onClick={confirmDiscard}
                className="hover:bg-neutral-700 px-4 py-3 border-stone-700 border-t-1 font-semibold text-red-400 transition cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={() => setShowDiscardModal(false)}
                className="hover:bg-neutral-700 px-4 py-3 border-stone-700 border-t-1 rounded-b-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
