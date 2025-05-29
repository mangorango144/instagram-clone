import { useEffect, useState } from "react";
import { PostType } from "../../../types";
import { getUsernameByUid } from "../../../utils";

export function PostCaption({ post }: { post: PostType }) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsername() {
      const name = await getUsernameByUid(post.uid);
      setUsername(name ?? null);
    }
    fetchUsername();
  }, [post]);

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
    <div className="flex items-start gap-3 text-sm">
      <img
        src={post.pfpUrl || "/assets/blank_pfp.png"}
        alt="Profile"
        className="mb-auto rounded-full min-w-9 size-9 object-cover"
      />

      <p className="text-white/87">
        <span className="mr-1 font-semibold text-white">{username}</span>{" "}
        {post.caption}
      </p>
    </div>
  );
}
