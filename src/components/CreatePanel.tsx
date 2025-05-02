import { useEffect, useRef, useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { LiaPhotoVideoSolid } from "react-icons/lia";
import { BsExclamationCircle } from "react-icons/bs";

interface CreatePanelProps {
  onClose: () => void;
  toggleRef: React.RefObject<HTMLElement>;
}

export function CreatePanel({ onClose, toggleRef }: CreatePanelProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const draggableImageRef = useRef<HTMLImageElement>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        (!toggleRef.current ||
          !toggleRef.current.contains(event.target as Node))
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const newX = e.clientX - startPos.x;
        const newY = e.clientY - startPos.y;

        setOffset({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, startPos]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (dragging) {
        const touch = e.touches[0];
        const newX = touch.clientX - startPos.x;
        const newY = touch.clientY - startPos.y;
        setOffset({ x: newX, y: newY });
      }
    };

    const handleTouchEnd = () => {
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, startPos]);

  const isValidMediaFile = (file: File) => {
    return file.type.startsWith("image/") || file.type.startsWith("video/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
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
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCloseAttempt = () => {
    if (mediaFile) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    onClose();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="z-50 fixed inset-0 flex justify-center items-start bg-black/80 py-5 overflow-y-auto custom-scrollbar"
    >
      <div
        ref={modalRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="flex flex-col bg-neutral-800 my-auto rounded-xl w-[348px] md:w-[690px] h-[397px] md:h-[739px]"
      >
        {/* Modal Header */}
        <div className="relative flex justify-center items-center p-3 border-stone-600 border-b text-white">
          <span className="font-semibold text-md">Create new post</span>
          <RiCloseLargeFill
            onClick={handleCloseAttempt}
            className="right-4 absolute text-xl hover:cursor-pointer"
          />
        </div>

        {/* Media section */}
        <div
          className={`flex flex-col flex-grow justify-center items-center space-y-4 text-white ${
            isDragging ? "border-1 border-sky-500" : ""
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
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  setDragging(true);
                  setStartPos({
                    x: touch.clientX - offset.x,
                    y: touch.clientY - offset.y,
                  });
                }}
                className="relative flex-grow w-full h-full overflow-hidden cursor-grab"
              >
                <img
                  ref={draggableImageRef}
                  src={previewUrl}
                  alt="preview"
                  className="top-0 left-0 absolute select-none"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                  }}
                  draggable={false}
                />
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
        <div className="z-60 absolute inset-0 flex justify-center items-center bg-black/50">
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
