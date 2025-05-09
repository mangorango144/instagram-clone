import { ModalStage } from "../constants";
import { Modal } from "../layout/components";

export function usePostModalClosing({
  mediaFile,
  discardIntent,
  onClose,
  setShowDiscardModal,
  setMediaFile,
  setPreviewUrl,
  setModalStage,
}: {
  mediaFile: File | null;
  discardIntent: React.RefObject<"close" | "back">;
  onClose: () => void;
  setShowDiscardModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMediaFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setModalStage: React.Dispatch<React.SetStateAction<ModalStage>>;
}) {
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
    } else {
      setMediaFile(null);
      setPreviewUrl(null);
      setModalStage(ModalStage.Upload);
      setShowDiscardModal(false);
    }
  };

  return { handleCloseAttempt, confirmDiscard };
}
