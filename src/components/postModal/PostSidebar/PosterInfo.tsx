import { useEffect, useState } from "react";
import { FirestoreUser, PostType } from "../../../types";
import { followUser, getUsernameByUid, unfollowUser } from "../../../utils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface PosterInfoProps {
  post: PostType;
  authUserFollowings: Map<string, FirestoreUser>;
}

export function PosterInfo({ post, authUserFollowings }: PosterInfoProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    setIsFollowing(authUserFollowings.has(post.uid));
  }, [authUserFollowings, post.uid]);

  const handleFollowToggle = async () => {
    if (!auth.uid || !post.uid) return;

    try {
      if (isFollowing) {
        await unfollowUser(auth.uid, post.uid);
        setIsFollowing(false);
      } else {
        await followUser(auth.uid, post.uid);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

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
      <Link to={`/${username}`} className="flex items-center">
        <img
          src={post.pfpUrl || "/assets/blank_pfp.png"}
          alt="Profile"
          className="rounded-full size-9 object-cover"
        />
        <span className="ml-3 font-semibold text-sm">{username}</span>
      </Link>
      {post.uid !== auth.uid && (
        <>
          <div className="bg-white/80 mx-2.5 rounded-full size-[5px]"></div>
          <button
            className="text-sky-500 hover:text-white hover:cursor-pointer"
            onClick={handleFollowToggle}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </>
      )}
    </div>
  );
}
