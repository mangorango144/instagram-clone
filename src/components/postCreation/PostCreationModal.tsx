import { useRef, useState } from "react";
import { PostModalLayout } from "./layout";
import { filters, ModalStage } from "./constants";
import {
  useDetermineDragDirection,
  useModalCloseListener,
  usePostModalClosing,
  useImageDragStart,
  useMediaFileInput,
  useFileDragHover,
  useImageDragging,
  useImageDragInit,
  useModalStage,
} from "./hooks";

interface PostCreationModalProps {
  onClose: () => void;
  toggleRef: React.RefObject<HTMLElement>;
}

export function PostCreationModal({
  onClose,
  toggleRef,
}: PostCreationModalProps) {
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const discardModalRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const draggableImageRef = useRef<HTMLImageElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const discardIntent = useRef<"close" | "back">("close");

  // Media State: Store for uploaded media and error messages
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingPost, setIsUploadingPost] = useState(false);
  const [selectedFilter, setSelectedFilter] =
    useState<keyof typeof filters>("Original");

  // UI State: Controls drag status, discard modal visibility, and modal stages
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [modalStage, setModalStage] = useState<ModalStage>(ModalStage.Upload);

  // Caption State: Manages the caption input
  const [caption, setCaption] = useState("");

  // Drag Position State: Manages image dragging behavior
  const [isDraggingImage, setIsImageDragging] = useState(false);
  const {
    imageDimensions,
    containerDimensions,
    dragDirection,
    setDragDirection,
    handleImageLoad,
  } = useImageDragInit(offsetRef);

  // Crop area based on drag offset and container size
  const crop = {
    x: -offsetRef.current.x,
    y: -offsetRef.current.y,
    width: containerDimensions.width,
    height: containerDimensions.height,
  };

  // File input handling logic
  const { fileInputRef, handleFileChange, handleFileSelectClick, handleDrop } =
    useMediaFileInput({
      setMediaFile,
      setPreviewUrl,
      setModalStage,
      setErrorMessage,
      setIsDraggingFile,
    });

  // Handlers for managing drag start (mousedown or touchstart)
  const { handleMouseDown, handleTouchDown } = useImageDragStart(
    offsetRef,
    startPosRef,
    modalStage,
    setIsImageDragging
  );

  // Handlers for navigating between modal stages
  const { handlePrev, handleNext, handleShare } = useModalStage({
    discardIntent,
    modalStage,
    selectedFilter,
    caption,
    setModalStage,
    setShowDiscardModal,
  });

  // Handling file drag hover effects
  const { handleDragOver, handleDragLeave } =
    useFileDragHover(setIsDraggingFile);

  // Handling for post modal closing
  const { handleCloseAttempt, confirmDiscard } = usePostModalClosing({
    mediaFile,
    discardIntent,
    onClose,
    setShowDiscardModal,
    setMediaFile,
    setPreviewUrl,
    setModalStage,
  });

  // Close modal when clicking outside of it or pressing escape (includes useEffect)
  useModalCloseListener({
    modalRef,
    toggleRef,
    discardModalRef,
    handleCloseAttempt,
  });

  // Handle dragging of the image (includes useEffect)
  useImageDragging({
    isDraggingImage,
    dragDirection,
    imageDimensions,
    containerDimensions,
    offsetRef,
    startPosRef,
    draggableImageRef,
    modalStage,
    setIsImageDragging,
  });

  // Determine drag direction based on image dimensions (includes useEffect)
  useDetermineDragDirection(previewUrl, setDragDirection);

  return (
    <PostModalLayout handleDrop={handleDrop} isDraggingImage={isDraggingImage}>
      <PostModalLayout.CloseButton onClose={handleCloseAttempt} />
      <PostModalLayout.Modal
        modalRef={modalRef}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
      >
        <PostModalLayout.Header
          modalStage={modalStage}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleShare={() =>
            handleShare(
              draggableImageRef.current as HTMLImageElement,
              crop,
              setIsUploadingPost,
              onClose
            )
          }
        />
        <PostModalLayout.MediaStage
          errorMessage={errorMessage}
          previewUrl={previewUrl}
          isDraggingFile={isDraggingFile}
          isDraggingImage={isDraggingImage}
          dragDirection={dragDirection}
          previewContainerRef={previewContainerRef}
          draggableImageRef={draggableImageRef}
          modalStage={modalStage}
          selectedFilter={selectedFilter}
          caption={caption}
          isUploadingPost={isUploadingPost}
          handleMouseDown={handleMouseDown}
          handleTouchDown={handleTouchDown}
          handleFileSelectClick={handleFileSelectClick}
          handleImageLoad={handleImageLoad}
          setSelectedFilter={setSelectedFilter}
          setCaption={setCaption}
        />
        <PostModalLayout.HiddenFileInput
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />
      </PostModalLayout.Modal>
      <PostModalLayout.DiscardModal
        showDiscardModal={showDiscardModal}
        onCancel={() => setShowDiscardModal(false)}
        onDiscard={confirmDiscard}
        discardModalRef={discardModalRef}
      />
    </PostModalLayout>
  );
}
