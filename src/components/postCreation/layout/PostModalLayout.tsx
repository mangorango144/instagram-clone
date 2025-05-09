import {
  HiddenFileInput,
  DiscardModal,
  CloseButton,
  MediaStage,
  Header,
  Modal,
} from "./components";

type PostModalLayoutProps = {
  children: React.ReactNode;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDraggingImage: boolean;
};

export function PostModalLayout({
  children,
  handleDrop,
  isDraggingImage,
}: PostModalLayoutProps) {
  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`z-50 fixed inset-0 flex justify-center items-start bg-black/80 py-5 overflow-y-auto custom-scrollbar ${
        isDraggingImage ? "cursor-grabbing" : ""
      }`}
    >
      {children}
    </div>
  );
}

PostModalLayout.CloseButton = CloseButton;
PostModalLayout.Modal = Modal;
PostModalLayout.Header = Header;
PostModalLayout.MediaStage = MediaStage;
PostModalLayout.HiddenFileInput = HiddenFileInput;
PostModalLayout.DiscardModal = DiscardModal;
