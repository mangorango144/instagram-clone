import { IoMdArrowBack } from "react-icons/io";
import { ModalStage } from "../../constants";

type HeaderProps = {
  modalStage: number;
  handlePrev: () => void;
  handleNext: () => void;
};

export function Header({ modalStage, handlePrev, handleNext }: HeaderProps) {
  const modalTitles = ["Create new post", "Crop", "Edit", "Create new post"];

  return (
    <div className="relative flex justify-center items-center p-3 border-stone-600 border-b text-white">
      {modalStage > ModalStage.Upload && (
        <IoMdArrowBack
          onClick={handlePrev}
          className="left-6 absolute text-white text-3xl hover:cursor-pointer"
        />
      )}
      <span className="font-semibold text-md">{modalTitles[modalStage]}</span>
      {modalStage > ModalStage.Upload && modalStage < ModalStage.Final && (
        <button
          onClick={handleNext}
          className="right-9 absolute font-semibold text-sky-500 hover:text-white text-sm hover:cursor-pointer"
        >
          Next
        </button>
      )}
      {modalStage === ModalStage.Final && (
        <button className="right-9 absolute font-semibold text-sky-500 hover:text-white text-sm hover:cursor-pointer">
          Share
        </button>
      )}
    </div>
  );
}
