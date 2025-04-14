import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config";
import { FirestoreUser } from "../../types";
import { SlOptions } from "react-icons/sl";
import { IoMdGrid } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { GrTag } from "react-icons/gr";
import { CiCamera } from "react-icons/ci";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export function UserPage() {
  const { username } = useParams<{ username: string }>();

  const navigate = useNavigate();

  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  const authUserName = useSelector((state: RootState) => state.auth.username);
  const location = useLocation();
  const segments = location.pathname.split("/");
  const isOwnProfile = segments[1] === authUserName;

  const isTagged = location.pathname.endsWith("/tagged");
  const isSaved = location.pathname.endsWith("/saved");

  // Mock data
  const posts: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  const tagged: number[] = [1, 2, 3, 4];
  const saved: number[] = [1, 2];

  const contentToShow = isTagged ? tagged : isSaved ? saved : posts;

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
          setUser(querySnapshot.docs[0].data() as FirestoreUser);
        } else {
          setUser(null); // No user found
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }

      setLoading(false);
    };

    fetchUser();
  }, [username]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!user) return <p className="text-white">User not found</p>;

  return (
    <div className="m-auto mt-8 md:px-0 w-full max-w-[935px]">
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-[284px_auto] h-[195px]">
        <div className="flex justify-center items-center row-span-4">
          <div className="bg-stone-500 rounded-full w-[150px] h-[150px]"></div>
        </div>

        <div className="flex items-center">
          <p className="mr-5 text-white text-xl">{user.username}</p>
          <button className="bg-sky-500 hover:bg-sky-600 px-5 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer">
            Follow
          </button>
          <SlOptions className="ml-3 h-full text-white text-xl hover:cursor-pointer" />
        </div>

        <div className="flex items-center gap-9 mt-4 text-stone-400">
          <p>
            <span className="font-semibold text-white">100</span> posts
          </p>
          <p>
            <span className="font-semibold text-white">101</span> followers
          </p>
          <p>
            <span className="font-semibold text-white">102</span> following
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
          <div className="flex flex-col flex-grow justify-center">
            <div className="flex items-center">
              <p className="text-white text-xl">{user.username}</p>
              <SlOptions className="ml-3 text-white text-xl hover:cursor-pointer" />
            </div>
            <button className="bg-sky-500 hover:bg-sky-600 mt-2 px-5 py-1.5 rounded-lg font-medium text-white text-sm hover:cursor-pointer">
              Follow
            </button>
          </div>
        </div>

        <div className="mt-3 px-4">
          <p className="font-medium text-white text-sm">{user.fullName}</p>
          <p className="text-white text-sm">Email: {user.email}</p>
        </div>

        <div className="flex justify-center gap-5 mt-3 py-5 border-stone-800 border-t-[1px] text-stone-400">
          <p>
            <span className="font-semibold text-white">100</span> posts
          </p>
          <p>
            <span className="font-semibold text-white">101</span> followers
          </p>
          <p>
            <span className="font-semibold text-white">102</span> following
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
          {contentToShow.map((post) => (
            <div className="bg-stone-500 aspect-square">{post}</div>
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
    </div>
  );
}
