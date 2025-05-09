export function useFileDragHover(
  setIsDraggingFile: React.Dispatch<React.SetStateAction<boolean>>
) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  return { handleDragOver, handleDragLeave };
}
