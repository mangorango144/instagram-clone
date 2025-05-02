import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FirestoreUser } from "../../types";
import { SlOptions } from "react-icons/sl";
import { BsGearWide } from "react-icons/bs";
import { IoMdGrid } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { GrTag } from "react-icons/gr";
import { CiCamera } from "react-icons/ci";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../../utils";
import { UserListModal } from "../../components";
import { db } from "../../config";
import { collection, getDocs, query, where } from "firebase/firestore";

export function UserPage() {
  // Router
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Redux
  const authUserName = useSelector((state: RootState) => state.auth.username);
  const authUserId = useSelector((state: RootState) => state.auth.uid);

  // Route flags
  const isOwnProfile = location.pathname.split("/")[1] === authUserName;
  const isTagged = location.pathname.endsWith("/tagged");
  const isSaved = location.pathname.endsWith("/saved");

  // Mock content
  const posts = [1, 2, 3, 4, 5, 6, 7, 8];
  const tagged = [1, 2, 3, 4];
  const saved = [1, 2];
  const contentToShow = isTagged ? tagged : isSaved ? saved : posts;

  // State
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<FirestoreUser[]>([]);
  const [following, setFollowing] = useState<FirestoreUser[]>([]);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [authUserFollowings, setAuthUserFollowings] = useState<
    Map<string, FirestoreUser>
  >(new Map());

  const fetchFollowersAndFollowing = async (uid: string) => {
    const [followerUsers, followingUsers] = await Promise.all([
      getFollowers(uid),
      getFollowing(uid),
    ]);

    setFollowers(followerUsers);
    setFollowing(followingUsers);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (isSaved && !isOwnProfile) {
        navigate(`/${username}`, { replace: true });
      }

      if (!username) return;
      setLoading(true);

      try {
        // Firestore query: Find the user by username
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const fetchedUser = { uid: doc.id, ...doc.data() } as FirestoreUser;

          setUser(fetchedUser);

          // Only fetch auth user's followings if authenticated
          if (authUserId) {
            const authFollowings = await getFollowing(authUserId);
            const authFollowingsMap = new Map(
              authFollowings.map((user) => [user.uid, user])
            );

            setAuthUserFollowings(authFollowingsMap);
            setIsFollowing(authFollowingsMap.has(fetchedUser.uid));
          }

          await fetchFollowersAndFollowing(fetchedUser.uid);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }

      setLoading(false);
    };

    fetchUser();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!authUserId || !user) return;

    try {
      if (isFollowing) {
        await unfollowUser(authUserId, user.uid);
        setIsFollowing(false);
      } else {
        await followUser(authUserId, user.uid);
        setIsFollowing(true);
      }

      await fetchFollowersAndFollowing(user.uid);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (!user) return <p className="text-white">User not found</p>;

  return (
    <div className="m-auto mt-8 md:px-0 w-full max-w-[935px]">
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-[200px_auto] lg:grid-cols-[284px_auto] h-[195px]">
        <div className="flex justify-center items-center row-span-4">
          <div className="bg-stone-500 rounded-full w-[150px] h-[150px]"></div>
        </div>

        <div className="flex items-center">
          <p className="mr-5 text-white text-xl">{user.username}</p>
          {isOwnProfile ? (
            <>
              <button className="bg-neutral-700 hover:bg-neutral-800 px-5 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer">
                Edit profile
              </button>
              <button className="bg-neutral-700 hover:bg-neutral-800 ml-2 px-5 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer">
                View archive
              </button>
              <BsGearWide className="ml-3 h-full text-white text-2xl hover:cursor-pointer" />
            </>
          ) : (
            <>
              <button
                onClick={handleFollowToggle}
                className={`${
                  isFollowing
                    ? "bg-neutral-700 hover:bg-neutral-800"
                    : "bg-sky-500 hover:bg-sky-600"
                } px-5 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              <SlOptions className="ml-3 h-full text-white text-xl hover:cursor-pointer" />
            </>
          )}
        </div>

        <div className="flex items-center gap-9 mt-4 text-stone-400">
          <p>
            <span className="font-semibold text-white">{posts.length}</span>{" "}
            posts
          </p>
          <p
            onClick={() => setModalType("followers")}
            className="hover:opacity-60 hover:cursor-pointer"
          >
            <span className="font-semibold text-white">{followers.length}</span>{" "}
            followers
          </p>
          <p
            onClick={() => setModalType("following")}
            className="hover:opacity-60 hover:cursor-pointer"
          >
            <span className="font-semibold text-white">{following.length}</span>{" "}
            following
          </p>
        </div>

        <div className="flex flex-col mt-2">
          <p className="font-medium text-white text-sm">{user.fullName}</p>
          <p className="text-white text-sm">Email: {user.email}</p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col mt-8">
        <div className="flex gap-6 px-4 w-full">
          <div className="bg-stone-500 rounded-full w-[77px] h-[77px]"></div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center">
              <p className="text-white text-xl">{user.username}</p>
              <BsGearWide className="ml-3 text-white text-xl hover:cursor-pointer" />
            </div>

            {isOwnProfile ? (
              <div className="flex gap-2">
                <button className="bg-neutral-700 hover:bg-neutral-800 mt-2 px-4 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer">
                  Edit Profile
                </button>
                <button className="bg-neutral-700 hover:bg-neutral-800 mt-2 px-4 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer">
                  View archive
                </button>
              </div>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`${
                  isFollowing
                    ? "bg-neutral-700 hover:bg-neutral-800"
                    : "bg-sky-500 hover:bg-sky-600"
                } mt-2 px-5 py-1.5 rounded-lg w-[224px] font-medium text-white text-sm hover:cursor-pointer`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 px-4">
          <p className="font-medium text-white text-sm">{user.fullName}</p>
          <p className="text-white text-sm">Email: {user.email}</p>
        </div>

        <div className="flex justify-center gap-5 mt-3 py-5 border-stone-800 border-t-[1px] text-stone-400">
          <p>
            <span className="font-semibold text-white">{posts.length}</span>{" "}
            posts
          </p>
          <p
            onClick={() => setModalType("followers")}
            className="hover:cursor-pointer"
          >
            <span className="font-semibold text-white">{followers.length}</span>{" "}
            followers
          </p>
          <p
            onClick={() => setModalType("following")}
            className="hover:cursor-pointer"
          >
            <span className="font-semibold text-white">{following.length}</span>{" "}
            following
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-between md:justify-center md:gap-[60px] md:mt-8 border-stone-800 border-t-[1px] h-[53px]">
        <Link
          to={`/${username}`}
          className={`flex justify-center items-center w-full md:w-auto h-full font-medium text-xs uppercase tracking-widest ${
            !isTagged && !isSaved
              ? "text-white border-t-[1px] border-white"
              : "text-stone-400"
          }`}
        >
          <IoMdGrid className="mr-1.5 md:text-base text-3xl" />
          <span className="hidden md:inline">Posts</span>
        </Link>
        {isOwnProfile && (
          <Link
            to={`/${username}/saved`}
            className={`flex justify-center items-center w-full md:w-auto h-full font-medium text-xs uppercase tracking-widest ${
              isSaved
                ? "text-white border-t-[1px] border-white"
                : "text-stone-400"
            }`}
          >
            <FaRegBookmark className="mr-1.5 md:text-sm text-2xl" />
            <span className="hidden md:inline">Saved</span>
          </Link>
        )}
        <Link
          to={`/${username}/tagged`}
          className={`flex justify-center items-center w-full md:w-auto h-full font-medium text-xs uppercase tracking-widest ${
            isTagged
              ? "text-white border-t-[1px] border-white"
              : "text-stone-400"
          }`}
        >
          <GrTag className="mr-1.5 md:text-sm text-2xl" />
          <span className="hidden md:inline">Tagged</span>
        </Link>
      </div>

      {/* Posts Section */}
      {contentToShow.length ? (
        <div className="gap-[3px] md:gap-[5px] grid grid-cols-3">
          {contentToShow.map((post, index) => (
            <div className="bg-stone-500 aspect-square" key={index}>
              {post}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-[60px]">
          <div className="flex flex-col items-center text-white">
            <div className="border-1 rounded-full">
              <CiCamera className="m-3 text-5xl" />
            </div>
            <p className="my-4 font-extrabold text-3xl">No Posts Yet</p>
          </div>
        </div>
      )}

      {modalType && (
        <UserListModal
          title={modalType === "followers" ? "Followers" : "Following"}
          users={modalType === "followers" ? followers : following}
          authUserFollowings={authUserFollowings}
          setAuthUserFollowings={setAuthUserFollowings}
          currentUserPage={user as FirestoreUser}
          fetchFollowersAndFollowing={fetchFollowersAndFollowing}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
