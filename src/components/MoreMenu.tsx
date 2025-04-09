import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks";
import { logOutAuth } from "../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CgDetailsMore } from "react-icons/cg";

export function MoreMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { logOut } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !(menuRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      dispatch(logOutAuth());
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="hidden xl:block relative m-4" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-start items-center md:hover:bg-stone-800 p-3 w-full hover:cursor-pointer"
      >
        <CgDetailsMore className="xl:mr-4 text-3xl" />
        More
      </button>

      {open && (
        <div className="bottom-full left-0 z-50 absolute bg-stone-800 mb-2 p-2 rounded-xl w-50">
          <button
            onClick={handleLogout}
            className="hover:bg-stone-700 px-4 py-4 rounded-xl w-full text-left hover:cursor-pointer"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
