import { useEffect, useState } from "react";
import { PostType } from "../../../types";
import { getUsernameByUid } from "../../../utils";

export function PosterInfo({ post }: { post: PostType }) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsername() {
      const name = await getUsernameByUid(post.uid);
      setUsername(name ?? null);
    }
    fetchUsername();
  }, [post.uid]);

  if (!username) {
    return (
      <div className="flex items-center px-4 py-3 lg:border-white/10 lg:border-b">
        {/* Placeholder while loading */}
        <div className="bg-stone-500 rounded-full size-9 animate-pulse"></div>
        <span className="ml-3 font-semibold text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center px-4 py-3 lg:border-white/10 lg:border-b">
      <div className="bg-stone-500 rounded-full size-9"></div>
      <span className="ml-3 font-semibold text-sm">{username}</span>
      <div className="bg-white/80 mx-2.5 rounded-full size-[5px]"></div>
      <button className="text-sky-500 hover:text-white hover:cursor-pointer">
        Follow
      </button>
    </div>
  );
}
