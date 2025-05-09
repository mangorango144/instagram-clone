type HiddenFileInputProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function HiddenFileInput({
  fileInputRef,
  handleFileChange,
}: HiddenFileInputProps) {
  return (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*,video/*"
      className="hidden"
      onChange={handleFileChange}
    />
  );
}
