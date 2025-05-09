import { useRef } from "react";
import { ModalStage } from "../constants";

interface UseMediaFileInputParams {
  setMediaFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setModalStage?: React.Dispatch<React.SetStateAction<ModalStage>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDraggingFile?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMediaFileInput = ({
  setMediaFile,
  setPreviewUrl,
  setModalStage,
  setErrorMessage,
  setIsDraggingFile,
}: UseMediaFileInputParams) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidMediaFile = (file: File) =>
    file.type.startsWith("image/") || file.type.startsWith("video/");

  const handleFile = (file: File, advanceToStage = true) => {
    if (isValidMediaFile(file)) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
      if (advanceToStage && setModalStage) setModalStage(ModalStage.Crop);
    } else {
      setMediaFile(null);
      setPreviewUrl(null);
      setErrorMessage(
        `${file.name} could not be uploaded. This file is not supported.`
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Allow same file selection
      fileInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile?.(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file, false);
  };

  return {
    fileInputRef,
    handleFileChange,
    handleFileSelectClick,
    handleDrop,
  };
};
