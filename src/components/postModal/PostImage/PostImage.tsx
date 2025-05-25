import { useState } from "react";

export function PostImage({ imageUrl }: { imageUrl: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full lg:size-[700px]">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/50">
          <div className="border-4 border-white border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
        </div>
      )}

      <img
        src={imageUrl}
        alt="post_image"
        className={`w-full h-full object-fill transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  );
}
