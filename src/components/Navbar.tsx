import { useRef, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { GrHomeRounded } from "react-icons/gr";
import { SlMagnifier } from "react-icons/sl";
import { GrWaypoint } from "react-icons/gr";
import { FaRegHeart } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { MoreMenu } from "./MoreMenu";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SearchPanel } from "./SearchPanel";
import { PostCreationModal } from "./postCreation";

const navClassName = `
  md:block md:top-0 bottom-0 left-0 fixed flex bg-black 
  border-stone-800 border-t-[1px] md:border-r-[1px] 
  w-screen md:w-[70px] 2xl:w-[270px] xl:w-[220px] 
  h-[48px] md:h-screen text-white
`;

const navbarLogoClass = `
  hidden lg:flex md:justify-center xl:justify-start items-center 
  py-10 font-vibes font-extrabold text-4xl
`;

const ulClassName = `
  flex flex-row md:flex-col justify-evenly items-center 
  xl:items-baseline md:space-y-1.5 xl:px-5 w-screen 
  md:w-auto md:h-screen lg:h-auto
`;

const iconClassName = "xl:mr-4 text-2xl";

export function Navbar() {
  const username = useSelector((state: RootState) => state.auth.username);

  const location = useLocation();
  const segments = location.pathname.split("/");
  const isOwnProfile = segments[1] === username;

  const searchToggleRef = useRef<HTMLLIElement>(null);
  const createToggleRef = useRef<HTMLLIElement>(null);

  const [activePanel, setActivePanel] = useState<null | "search" | "create">(
    null
  );
  const isPanelOpen = activePanel !== null && activePanel !== "create";

  const navItems = [
    {
      label: "Home",
      icon: <GrHomeRounded className={iconClassName} />,
      to: "/",
    },
    {
      label: "Search",
      icon: <SlMagnifier className={iconClassName} />,
      ref: searchToggleRef,
      onClick: (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        setActivePanel((prev) => (prev === "search" ? null : "search"));
      },
    },
    { label: "Messages", icon: <GrWaypoint className={iconClassName} /> },
    { label: "Notifications", icon: <FaRegHeart className={iconClassName} /> },
    {
      label: "Create",
      icon: <FiPlusSquare className={iconClassName} />,
      ref: createToggleRef,
      onClick: (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        setActivePanel((prev) => (prev === "create" ? null : "create"));
      },
    },
    {
      label: "Profile",
      icon: (
        <div
          className={`bg-stone-500 xl:mr-4 rounded-full w-6 h-6 
            ${isOwnProfile ? "outline-2" : ""}`}
        />
      ),
      to: `/${username}`,
      extraClasses: "font-bold",
    },
  ];

  return (
    <nav className={navClassName}>
      <div className="flex flex-col justify-between w-full h-full">
        <div>
          <Link to="/" className={navbarLogoClass}>
            <FaInstagram
              className={`xl:ml-6.5 inline h-10 hover:cursor-pointer ${
                isPanelOpen ? "xl:inline" : "xl:hidden"
              }`}
            />
            <span
              className={`xl:px-8 hover:cursor-pointer hidden ${
                isPanelOpen ? "xl:hidden" : "xl:inline"
              }`}
            >
              InstaClone
            </span>
          </Link>

          <ul className={ulClassName}>
            {navItems.map(
              ({ label, icon, to, ref, onClick, extraClasses = "" }, index) => {
                const classes = `flex justify-center xl:justify-start items-center md:hover:bg-stone-800 p-3 w-full hover:cursor-pointer ${extraClasses}`;
                const content = (
                  <>
                    {icon}
                    <span className={`hidden xl:inline ${extraClasses}`}>
                      {label}
                    </span>
                  </>
                );

                return to ? (
                  <Link key={index} to={to} className={classes}>
                    {content}
                  </Link>
                ) : (
                  <li
                    key={index}
                    className={classes}
                    ref={ref}
                    onClick={onClick}
                  >
                    {content}
                  </li>
                );
              }
            )}
          </ul>
        </div>

        <MoreMenu />
      </div>

      {activePanel === "search" && (
        <SearchPanel
          onClose={() => setActivePanel(null)}
          toggleRef={searchToggleRef as React.RefObject<HTMLElement>}
        />
      )}

      {activePanel === "create" && (
        <PostCreationModal
          onClose={() => setActivePanel(null)}
          toggleRef={createToggleRef as React.RefObject<HTMLElement>}
        />
      )}
    </nav>
  );
}
