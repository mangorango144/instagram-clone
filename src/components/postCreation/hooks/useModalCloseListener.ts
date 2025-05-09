import { useEffect } from "react";

interface UseModalCloseListenerProps {
  modalRef: React.RefObject<HTMLElement | null>;
  toggleRef: React.RefObject<HTMLElement>;
  discardModalRef: React.RefObject<HTMLElement | null>;
  handleCloseAttempt: () => void;
}

export const useModalCloseListener = ({
  modalRef,
  toggleRef,
  discardModalRef,
  handleCloseAttempt,
}: UseModalCloseListenerProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        (!toggleRef.current || !toggleRef.current.contains(target)) &&
        (!discardModalRef.current || !discardModalRef.current.contains(target))
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
      document.body.style.overflow = originalStyle;
    };
  }, [handleCloseAttempt]);
};
