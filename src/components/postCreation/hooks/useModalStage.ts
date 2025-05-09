import { ModalStage } from "../constants";

export function useModalStage({
  discardIntent,
  modalStage,
  setModalStage,
  setShowDiscardModal,
}: {
  discardIntent: React.RefObject<"close" | "back">;
  modalStage: ModalStage;
  setModalStage: React.Dispatch<React.SetStateAction<ModalStage>>;
  setShowDiscardModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handlePrev = () => {
    if (modalStage === ModalStage.Crop) {
      discardIntent.current = "back";
      setShowDiscardModal(true);
    } else {
      setModalStage((prev) => (prev - 1) as ModalStage);
    }
  };

  const handleNext = () => {
    if (modalStage < ModalStage.Final) {
      setModalStage((prev) => (prev + 1) as ModalStage);
    }
  };

  return { handlePrev, handleNext };
}
