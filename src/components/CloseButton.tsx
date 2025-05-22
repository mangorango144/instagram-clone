import { RiCloseLargeFill } from "react-icons/ri";

type CloseButtonProps = {
  onClose: () => void;
  extraClasses?: string;
};

export function CloseButton({ onClose, extraClasses = "" }: CloseButtonProps) {
  return (
    <RiCloseLargeFill
      onClick={onClose}
      className={`top-5 right-5 fixed text-white text-2xl hover:cursor-pointer ${extraClasses}`}
    />
  );
}
