import { RefObject } from "react";

type ModalProps = {
  children: React.ReactNode;
  modalRef: RefObject<HTMLDivElement | null>;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
};

export function Modal({
  children,
  modalRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
}: ModalProps) {
  return (
    <div
      ref={modalRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className="flex flex-col bg-neutral-800 my-auto rounded-xl w-[348px] md:w-[690px] h-[397px] md:h-[739px]"
    >
      {children}
    </div>
  );
}
