import { useEffect, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { SlMagnifier } from "react-icons/sl";
import { FirestoreUser } from "../types";
import { searchUsersByUsernameOrName } from "../utils";
import { Link } from "react-router-dom";

interface SearchPanelProps {
  onClose: () => void;
  toggleRef: React.RefObject<HTMLElement>;
}

export function SearchPanel({ onClose, toggleRef }: SearchPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FirestoreUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        (!toggleRef.current ||
          !toggleRef.current.contains(event.target as Node))
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    // Autofocus the input
    inputRef.current?.focus();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, toggleRef]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      const users = await searchUsersByUsernameOrName(query.toLowerCase());
      setResults(users);
      setIsLoading(false);
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const mockResults: FirestoreUser[] = Array.from({ length: 20 }, (_, i) => ({
      uid: `user-${i + 1}`,
      username: `mockuser${i + 1}`,
      fullName: `Mock User ${i + 1}`,
      email: `mockuser${i + 1}@example.com`,
    }));

    setResults(mockResults);
  }, []);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.blur();
  };

  return (
    <div
      ref={panelRef}
      className="top-0 md:top-0 bottom-[48px] md:bottom-0 md:left-[70px] z-50 fixed inset-x-0 md:inset-x-auto bg-black px-4 py-6 border-stone-800 md:border-r md:w-[397px] md:h-screen"
    >
      <h2 className="mb-11 ml-3 font-semibold text-white text-2xl">Search</h2>
      <div className="relative">
        {!isInputFocused && (
          <SlMagnifier className="top-1/2 left-4 absolute text-neutral-400 -translate-y-1/2 pointer-events-none" />
        )}

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          type="text"
          className={`bg-neutral-700 ${
            isInputFocused ? "pl-4" : "pl-11"
          } pr-10 py-2 rounded-md focus:outline-none w-full placeholder:text-neutral-400 ${
            isInputFocused ? "text-white" : "text-neutral-400"
          }`}
          placeholder="Search"
        />
        {isInputFocused && (
          <IoIosCloseCircle
            onMouseDown={(e) => e.preventDefault()} // prevents input blur
            onClick={handleClear}
            className="top-1/2 right-4 absolute flex text-neutral-300 text-lg -translate-y-1/2 hover:cursor-pointer"
          />
        )}
      </div>

      {/* Results */}
      {isLoading && <p className="px-3 text-neutral-400">Searching...</p>}
      {!isLoading && results.length === 0 && query && (
        <p className="px-3 text-neutral-400">No users found</p>
      )}
      {!isLoading && results.length > 0 && (
        <div className="mt-6 pr-1 h-[calc(100%-130px)] md:h-[calc(100%-160px)] overflow-y-auto custom-scrollbar">
          <ul className="space-y-4">
            {results.map((user) => (
              <li key={user.uid}>
                <Link
                  to={`/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-4 hover:bg-neutral-800 px-3 py-2 rounded-md"
                >
                  <div className="bg-stone-500 rounded-full w-10 h-10"></div>
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {user.username}
                    </span>
                    <span className="text-neutral-400 text-sm">
                      {user.fullName}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
