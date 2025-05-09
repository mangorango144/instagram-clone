type DiscardModalProps = {
  showDiscardModal: boolean;
  discardModalRef: React.RefObject<HTMLDivElement | null>;
  onDiscard: () => void;
  onCancel: () => void;
};

export function DiscardModal({
  showDiscardModal,
  discardModalRef,
  onDiscard: confirmDiscard,
  onCancel,
}: DiscardModalProps) {
  if (!showDiscardModal) return null;

  return (
    <div
      ref={discardModalRef}
      className="z-60 absolute inset-0 flex justify-center items-center bg-black/50"
    >
      <div className="flex flex-col items-center bg-neutral-800 pt-6 rounded-xl w-[330px] text-white">
        <h2 className="font-base text-xl">Discard post?</h2>
        <span className="mb-6 pt-1 text-stone-400 text-sm text-center">
          If you leave, your edits won't be saved.
        </span>
        <div className="flex flex-col w-full text-sm">
          <button
            onClick={confirmDiscard}
            className="hover:bg-neutral-700 px-4 py-3 border-stone-700 border-t-1 font-semibold text-red-400 transition cursor-pointer"
          >
            Discard
          </button>
          <button
            onClick={onCancel}
            className="hover:bg-neutral-700 px-4 py-3 border-stone-700 border-t-1 rounded-b-xl transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
