export function PostImage({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="w-full lg:size-[700px]">
      <img
        src={imageUrl}
        alt="post_image"
        className="w-full h-full object-fill"
      />
    </div>
  );
}
