import {
  HiddenFileInput,
  DiscardModal,
  MediaStage,
  Header,
  Modal,
} from "./components";

type PostModalLayoutProps = {
  children: React.ReactNode;
  isDraggingImage: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

export function PostModalLayout({
  children,
  isDraggingImage,
  handleDrop,
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

PostModalLayout.Modal = Modal;
PostModalLayout.Header = Header;
PostModalLayout.MediaStage = MediaStage;
PostModalLayout.HiddenFileInput = HiddenFileInput;
PostModalLayout.DiscardModal = DiscardModal;
