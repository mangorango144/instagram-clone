import { FaInstagram } from "react-icons/fa";
import { GrHomeRounded } from "react-icons/gr";
import { SlMagnifier } from "react-icons/sl";
import { GrWaypoint } from "react-icons/gr";
import { FaRegHeart } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";

const navClassName = `
  md:block md:top-0 bottom-0 left-0 fixed flex bg-black 
  border-stone-800 border-t-[1px] md:border-r-[1px] 
  w-screen md:w-[70px] 2xl:w-[270px] xl:w-[220px] 
  h-[48px] md:h-screen
`;

const h1ClassName = `
  hidden lg:flex md:justify-center xl:justify-start items-center 
  xl:px-8 py-10 font-vibes font-extrabold text-white text-4xl
`;

const ulClassName = `
  flex flex-row md:flex-col justify-evenly items-center 
  xl:items-baseline md:space-y-1.5 xl:px-5 w-screen 
  md:w-auto md:h-screen lg:h-auto
`;

export function Navbar() {
  return (
    <nav className={navClassName}>
      <h1 className={h1ClassName}>
        <FaInstagram className="xl:hidden inline hover:cursor-pointer" />
        <span className="hidden xl:inline hover:cursor-pointer">
          InstaClone
        </span>
      </h1>
      <ul className={ulClassName}>
        <li className="flex items-center md:hover:bg-stone-800 p-3 text-white hover:cursor-pointer">
          <GrHomeRounded className="xl:mr-4 text-2xl" />
          <span className="hidden xl:inline">Home</span>
        </li>
        <li className="flex justify-center md:items-center md:hover:bg-stone-800 p-3 text-white hover:cursor-pointer">
          <SlMagnifier className="xl:mr-4 text-2xl" />
          <span className="hidden xl:inline">Search</span>
        </li>
        <li className="flex justify-center md:items-center md:hover:bg-stone-800 p-3 text-white hover:cursor-pointer">
          <GrWaypoint className="xl:mr-4 text-2xl" />
          <span className="hidden xl:inline">Messages</span>
        </li>
        <li className="flex justify-center md:items-center md:hover:bg-stone-800 p-3 text-white hover:cursor-pointer">
          <FaRegHeart className="xl:mr-4 text-2xl" />
          <span className="hidden xl:inline">Notifications</span>
        </li>
        <li className="flex justify-center md:items-center md:hover:bg-stone-800 p-3 text-white hover:cursor-pointer">
          <FiPlusSquare className="xl:mr-4 text-2xl" />
          <span className="hidden xl:inline">Create</span>
        </li>
        <li className="flex justify-center md:items-center md:hover:bg-stone-800 p-3 font-bold text-white hover:cursor-pointer">
          <div className="bg-stone-500 xl:mr-4 rounded-full outline-2 w-6 h-6"></div>
          <span className="hidden xl:inline">Profile</span>
        </li>
      </ul>
    </nav>
  );
}
