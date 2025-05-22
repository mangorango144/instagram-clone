export function PostImage({ postId }: { postId: number }) {
  return (
    <div className="w-full lg:size-[700px]">
      {/* <img
        src="assets/cropped.jpg"
        alt="post_image"
        className="w-full h-full object-fill"
      /> */}
      <div className="flex justify-center items-center bg-black rounded-4xl w-full lg:size-[700px] font-bold text-white text-3xl">
        Post {postId}
      </div>
    </div>
  );
}
