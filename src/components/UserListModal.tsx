import { useEffect, useRef, useState } from "react";
import { FirestoreUser } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";
import { followUser, unfollowUser } from "../utils";
import { SlMagnifier } from "react-icons/sl";
import { IoIosCloseCircle } from "react-icons/io";
import { RiCloseLargeFill } from "react-icons/ri";

interface Props {
  title: string;
  users: FirestoreUser[];
  authUserFollowings: Map<string, FirestoreUser>;
  setAuthUserFollowings: (followings: Map<string, FirestoreUser>) => void;
  currentUserPage: FirestoreUser;
  fetchFollowersAndFollowing: (uid: string) => Promise<void>;
  onClose: () => void;
}

export function UserListModal({
  title,
  users,
  authUserFollowings,
  setAuthUserFollowings,
  currentUserPage,
  fetchFollowersAndFollowing,
  onClose,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const [displayUsers, setDisplayUsers] = useState<FirestoreUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [loadingFollowState, setLoadingFollowState] = useState<string | null>(
    null
  );

  // Close on outside click
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Close on Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    // Generate 20 mock users
    const mockUsers: FirestoreUser[] = Array.from(
      { length: 20 },
      (_, index) => ({
        uid: `mock${index + 1}`,
        username: `mock_user${index + 1}`,
        fullName: `Mock User ${index + 1}`,
        email: `mock${index + 1}@example.com`,
      })
    );

    // Merge real users and mock users for display
    setDisplayUsers([...users, ...mockUsers]);
  }, [users]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    // Prevent body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);

      // Restore original body overflow style
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleFollowToggle = async (user: FirestoreUser) => {
    if (!auth.uid) return;

    setLoadingFollowState(user.uid);

    try {
      if (authUserFollowings.has(user.uid)) {
        await unfollowUser(auth.uid, user.uid);
        authUserFollowings.delete(user.uid);
      } else {
        await followUser(auth.uid, user.uid);
        authUserFollowings.set(user.uid, user);
      }

      // Trigger a re-render by updating the state
      setAuthUserFollowings(new Map(authUserFollowings));

      // Fetch followers and following again to update the UI
      await fetchFollowersAndFollowing(currentUserPage.uid);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setLoadingFollowState(null);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.blur();
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-start bg-black/80 py-5 overflow-y-auto custom-scrollbar">
      <div
        ref={modalRef}
        className="flex flex-col bg-neutral-800 my-auto rounded-xl w-[300px] sm:w-[400px] h-[400px] text-white"
      >
        {/* Modal Header */}
        <div className="relative flex justify-center items-center py-3 border-neutral-700 border-b">
          <h2 className="font-semibold text-md">{title}</h2>
          <button
            onClick={onClose}
            className="right-0 absolute mr-4 text-white text-xl hover:cursor-pointer"
          >
            <RiCloseLargeFill />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex justify-center items-center my-2 px-4 w-full">
          {!isInputFocused && (
            <SlMagnifier className="left-8 absolute text-stone-400" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            className={`bg-neutral-700 py-1.5 rounded-lg focus:outline-none w-full text-white placeholder:text-stone-400 text-sm transition-all duration-150 ${
              isInputFocused ? "pl-4" : "pl-10"
            }`}
          />
          {isInputFocused && (
            <IoIosCloseCircle
              onMouseDown={(e) => e.preventDefault()} // prevents input blur
              onClick={handleClear}
              className="right-6 absolute text-white"
            />
          )}
        </div>

        {/* Scrollable User List */}
        <ul className="flex-1 space-y-4 ml-4 pt-2 pr-4 pb-4 overflow-y-auto">
          {displayUsers.filter((u) => {
            const search = searchTerm.toLowerCase();
            return (
              u.username.toLowerCase().includes(search) ||
              u.fullName.toLowerCase().includes(search)
            );
          }).length ? (
            displayUsers
              .filter((u) => {
                const search = searchTerm.toLowerCase();
                return (
                  u.username.toLowerCase().includes(search) ||
                  u.fullName.toLowerCase().includes(search)
                );
              })
              .map((u) => {
                const isFollowing = authUserFollowings.has(u.uid);

                return (
                  <li
                    key={u.username}
                    className="flex justify-between items-center gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Link to={`/${u.username}`} onClick={onClose}>
                        <div className="bg-stone-700 rounded-full size-11" />
                      </Link>
                      <div className="flex flex-col">
                        <Link
                          to={`/${u.username}`}
                          onClick={onClose}
                          className="font-semibold text-white text-xs md:text-sm"
                        >
                          {u.username}
                        </Link>
                        <p className="text-stone-400 text-xs">{u.fullName}</p>
                      </div>
                    </div>
                    {u.username !== auth.username && (
                      <button
                        onClick={() => handleFollowToggle(u)}
                        disabled={loadingFollowState === u.uid}
                        className={`px-5 py-1.5 rounded-lg font-semibold text-sm hover:cursor-pointer
                                  ${
                                    isFollowing
                                      ? "bg-stone-700 text-white hover:bg-stone-600"
                                      : "bg-sky-500 text-white hover:bg-sky-600"
                                  }`}
                      >
                        {loadingFollowState === u.uid
                          ? "Loading..."
                          : isFollowing
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                    )}
                  </li>
                );
              })
          ) : (
            <p className="text-stone-400 text-sm">No users found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
