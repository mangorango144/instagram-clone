import { RiCloseLargeFill } from "react-icons/ri";

type CloseButtonProps = {
  onClose: () => void;
};

export function CloseButton({ onClose: onClick }: CloseButtonProps) {
  return (
    <RiCloseLargeFill
      onClick={onClick}
      className="right-5 absolute text-2xl hover:cursor-pointer"
    />
  );
}
